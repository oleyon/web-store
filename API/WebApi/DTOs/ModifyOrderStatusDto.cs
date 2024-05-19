using WebApi.Models;

namespace WebApi.DTOs
{
    public class ModifyOrderStatusDto
    {
        public int Id { get; set; }
        public OrderStatus Status { get; set; }
    }
}
