using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Packaging;
using WebApi.Db;
using WebApi.DTOs;
using WebApi.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
        IMapper _mapper;
        IWebHostEnvironment _webHostEnvironment;

        public ProductsController(AppDbContext context, IMapper mapper, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _mapper = mapper;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult GetProducts([FromQuery] string? name = null, [FromQuery] string? categoryIds = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var query = _context.Products.Include(p => p.Categories).AsQueryable();

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(p => p.Name.Contains(name));
            }

            if (!string.IsNullOrEmpty(categoryIds))
            {
                var categoryIdList = categoryIds.Split(',')
                                                .Where(id => int.TryParse(id, out _))
                                                .Select(int.Parse)
                                                .ToList();
                if (categoryIdList.Any())
                {
                    foreach (var categoryId in categoryIdList)
                    {
                        query = query.Where(p => p.Categories.Any(c => c.Id == categoryId));
                    }
                }
            }

            var totalCount = query.Count();
            var products = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            var productDtos = _mapper.Map<List<ProductDto>>(products);

            var response = new
            {
                items = productDtos,
                totalCount = totalCount
            };

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
          if (_context.Products == null)
          {
              return NotFound();
          }
            var product = _context.Products.Include(p => p.Categories).Where(p => p.Id == id).First();

            if (product == null)
            {
                return NotFound();
            }
            var productDto = _mapper.Map<ProductDto>(product);
            return productDto;
        }

        [HttpPost]
        public IActionResult CreateProduct([FromForm] ProductAddRequestDto productDto, IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("Image file is required.");
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                image.CopyTo(fileStream);
            }

            var product = _mapper.Map<Product>(productDto);
            product.ImageUrl = "/images/" + fileName;
            if (productDto.CategoryIds != null && productDto.CategoryIds.Any())
            {
                var categories = _context.Categories.Where(c => productDto.CategoryIds.Contains(c.Id)).ToList();
                product.Categories = categories;
            }

            _context.Products.Add(product);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost("modify/{productId}")]
        public IActionResult ModifyProduct([FromRoute] int productId, [FromForm] ProductAddRequestDto productDto)
        {
            var existingProduct = _context.Products.Include(p => p.Categories).Where(p => p.Id == productId).First();
            existingProduct.Name = productDto.Name;
            existingProduct.Description = productDto.Description;
            existingProduct.Price = productDto.Price;
            existingProduct.Quantity = productDto.Quantity;

            if (productDto.CategoryIds != null && productDto.CategoryIds.Any())
            {
                var categories = _context.Categories.Where(c => productDto.CategoryIds.Contains(c.Id)).ToList();
                existingProduct.Categories.Clear();
                existingProduct.Categories.AddRange(categories);
            }
            _context.SaveChanges();

            return Ok();
        }
    }
}
