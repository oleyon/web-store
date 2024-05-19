namespace WebApi.DTOs
{
    public class ProductAddRequestDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public List<int>? CategoryIds { get; set; }
    }
}
