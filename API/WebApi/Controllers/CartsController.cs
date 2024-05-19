using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Db;
using WebApi.DTOs;
using WebApi.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly AppDbContext _context;
        IMapper _mapper;

        public CartsController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> GetCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound();
            }
            var cartDto = _mapper.Map<CartDto>(cart);
            return cartDto.CartItems;
        }

        [HttpPost("add/{productId}/{quantity}")]
        public async Task<ActionResult> AddToCart([FromRoute]int productId, [FromRoute]int quantity=1)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound();
            }

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart != null)
            {
                var existingItem = cart.CartItems.Where(ci => ci.ProductId == productId).FirstOrDefault();
                if (existingItem == null)
                {
                    cart.CartItems.Add(new CartItem { ProductId = productId, Quantity = Math.Max(Math.Min(quantity, product.Quantity),0) });
                }
                else if (existingItem.Quantity + quantity >= 0 && existingItem.Quantity + quantity <= product.Quantity)
                {
                    existingItem.Quantity += quantity;
                }
            }
            
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPost("set/{productId}/{quantity}")]
        public async Task<ActionResult> SetCartItem([FromRoute] int productId, [FromRoute] int quantity = 1)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound();
            }

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart != null)
            {
                var existingItem = cart.CartItems.Where(ci => ci.ProductId == productId).FirstOrDefault();
                if (quantity >= 0 && quantity <= product.Quantity)
                {
                    if (existingItem != null)
                    {
                        existingItem.Quantity = quantity;
                    }
                    else
                    {
                        cart.CartItems.Add(new CartItem { ProductId = productId, Quantity = quantity });
                    }
                }
                else
                {
                    if (product.Quantity < quantity)
                        existingItem.Quantity = product.Quantity;
                    else
                        existingItem.Quantity = 0;
                }
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("remove/{productId}")]
        public async Task<ActionResult> RemoveFromCart([FromRoute]int productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var cart = await _context.Carts.FirstAsync(c => c.UserId == userId);
            var cartItem = await _context.CartItems.FindAsync(cart.Id, productId);
            if (cartItem == null)
            {
                return NotFound();
            }
            if (cartItem.CartId != cart.Id)
            {
                return Forbid();
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
