namespace WebApi.Models
{
    public enum OrderStatus
    {
        Processing,
        Delivered,
        Completed,
        Cancelled
    }

    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ProductId { get; set; }
        public DateTime Date { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public OrderStatus Status { get; set; }
        public virtual Product Product { get; set; }
        public virtual AppUser User { get; set; }
    }
}
