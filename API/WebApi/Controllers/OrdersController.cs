using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        UserManager<AppUser> _userManager;
        IMapper _mapper;

        public OrdersController(AppDbContext context, UserManager<AppUser> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders(OrderStatus? status)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("admin");
            var query = _context.Orders.AsQueryable();
            query = query.Include(ci => ci.Product);
            if (!isAdmin)
            {
                query = query.Where(x => x.UserId == userId);
            }
            if (isAdmin)
            {
                query = query.Include(ci => ci.User);
            }

            if (status is not null)
            {
                query = query.Where(o => o.Status == status);
            }
            var orders = query.OrderByDescending(o => o.Date).ToList();
            var orderDtos = _mapper.Map<List<OrderDto>>(orders);
            return orderDtos;
        }
        [Authorize(Roles = "admin")]
        [HttpPost("modifystatus")]
        public async Task<ActionResult> ModifyStatus(ModifyOrderStatusDto modifyOrderStatusDto)
        {
            var order = _context.Orders.Find(modifyOrderStatusDto.Id);
            if (order == null)
            {
                return BadRequest();
            }
            order.Status = modifyOrderStatusDto.Status;
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("checkout")]
        public async Task<ActionResult<Order>> PostOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);
            var cart = _context.Carts.Where(c => c.UserId == user.Id).First();
            var cartItems = _context.CartItems.Include(ci => ci.Product).Where(ci => ci.CartId == cart.Id).ToList();

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach(var item in cartItems)
                    {
                        var product = item.Product;
                        Console.WriteLine(product.Id);
                        if (product.Quantity < item.Quantity)
                        {
                            return BadRequest("Product quantity is less than item quantity in cart");
                        }
                        if (item.Quantity > 0)
                        {
                            product.Quantity -= item.Quantity;
                            Order order = new Order
                            {
                                Quantity = item.Quantity,
                                Status = OrderStatus.Processing,
                                Date = DateTime.UtcNow,
                                Price = product.Price,
                                Product = product,
                                User = user
                            };
                            _context.Orders.Add(order);
                            _context.CartItems.Remove(item);
                        }

                    }
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return Ok();
                }
                catch (DbUpdateConcurrencyException)
                {
                    await transaction.RollbackAsync();
                    return Conflict("Concurrency issue occurred. Please try again.");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, $"An error occurred: {ex.Message}, {ex.StackTrace}");
                }
            }
        }
    }
}
