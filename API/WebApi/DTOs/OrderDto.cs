using WebApi.Models;

namespace WebApi.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public OrderStatus Status { get; set; }
        public virtual ProductDto Product { get; set; }
        public virtual UserDto User { get; set; }
    }
}
