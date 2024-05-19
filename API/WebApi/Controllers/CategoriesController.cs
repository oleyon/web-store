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
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        IMapper _mapper;

        public CategoriesController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
          if (_context.Categories == null)
          {
              return NotFound();
          }
            return await _context.Categories.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
          if (_context.Categories == null)
          {
              return NotFound();
          }
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        [HttpPost]
        [Authorize(Roles="admin")]
        public async Task<ActionResult<Category>> PostCategory(CategoryPostRequestDto category)
        {
            var categoryModel = _mapper.Map<Category>(category);
            _context.Categories.Add(categoryModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = categoryModel.Id }, category);
        }
    }
}
