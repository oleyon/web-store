using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebApi.Db;
using WebApi.DTOs;
using WebApi.Models;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        UserManager<AppUser> _userManager;
        RedisService _redisService;
        IMapper _mapper;
        TokenService _tokenService;
        AppDbContext _context;
        public AuthController(UserManager<AppUser> userManager, RedisService redisService, IMapper mapper, TokenService tokenService, AppDbContext appDbContext)
        {
            _userManager = userManager;
            _redisService = redisService;
            _mapper = mapper;
            _tokenService = tokenService;
            _context = appDbContext;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody]RegisterRequestDto registerDto)
        {
            var user = _mapper.Map<AppUser>(registerDto);
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "user");
                _context.Carts.Add(new Cart
                {
                    User = await _userManager.FindByNameAsync(user.UserName)
                });
                _context.SaveChanges();
                return Ok("Registration successful.");
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return BadRequest(ModelState);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized("Invalid email or password.");
            }
            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _tokenService.GenerateAccessToken(user, roles);
            var refreshToken = _tokenService.GenerateRefreshToken(user.Id);

            _redisService.StoreRefreshToken(user.Id, refreshToken, TimeSpan.FromDays(1));
            refreshToken = $"{user.Id}/{refreshToken}";
            Response.Cookies.Append("accessToken", accessToken, new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(5),
                HttpOnly = true
            });
            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                Path = "/api/auth",
                Expires = DateTimeOffset.UtcNow.AddDays(1),
                HttpOnly = true
            });

            var userRoles = await _userManager.GetRolesAsync(user);
            var userDto = new UserResponseDto
            {
                Username = user.UserName,
                Role = userRoles.FirstOrDefault(),
                Email = user.Email
            };

            return Ok(userDto);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var userToken = refreshToken.Split("/");
            var userId = userToken[0];
            refreshToken = userToken[1];
            if (!string.IsNullOrEmpty(userId))
            {
                _redisService.DeleteRefreshToken(userId, refreshToken);
            }
            Response.Cookies.Delete("refreshToken");
            Response.Cookies.Delete("accessToken");
            return NoContent();
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (refreshToken == null)
                return Unauthorized();
            var userToken = refreshToken.Split("/");
            var userId = userToken[0];
            
            refreshToken = userToken[1];
            if (_redisService.DoesRefreshTokenExist(userId, refreshToken))
            {
                AppUser user;
                user = await _userManager.FindByIdAsync(userId);
                var roles = await _userManager.GetRolesAsync(user);
                var accessToken = _tokenService.GenerateAccessToken(user, roles);
                var newRefreshToken = _tokenService.GenerateRefreshToken(userId);
                _redisService.DeleteRefreshToken(userId, refreshToken);
                _redisService.StoreRefreshToken(userId, newRefreshToken, TimeSpan.FromDays(1));
                newRefreshToken = $"{userId}/{newRefreshToken}";
                refreshToken = $"{userId}/{refreshToken}";
                Response.Cookies.Append("accessToken", accessToken, new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddMinutes(5),
                    HttpOnly = true
                });
                Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
                {
                    Path = "/api/auth",
                    Expires = DateTimeOffset.UtcNow.AddDays(1),
                    HttpOnly = true
                });
                return Ok();
            }

            return Unauthorized();
        }

        [Authorize]
        [HttpGet("getuser")]
        public async Task<ActionResult<UserResponseDto>> GetUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var userDto = new UserResponseDto
            {
                Username = user.UserName,
                Role = userRoles.FirstOrDefault(),
                Email = user.Email
            };

            return Ok(userDto);
        }
    }
}
