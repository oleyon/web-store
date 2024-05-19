using AutoMapper;
using WebApi.DTOs;
using WebApi.Models;

namespace WebApi.Services
{
    public class AutoMapperService : Profile
    {
        public AutoMapperService()
        {
            CreateMap<RegisterRequestDto, AppUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));
            CreateMap<CategoryPostRequestDto, Category>()
                .ForMember(dest => dest.Products, opt => opt.Ignore());
            CreateMap<ProductAddRequestDto, Product>();
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name })));
            CreateMap<CartItem, CartItemDto>()
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product));
            CreateMap<Cart, CartDto>()
                .ForMember(dest => dest.CartItems, opt => opt.MapFrom(src => src.CartItems));
            CreateMap<AppUser, UserDto>();
            CreateMap<Order, OrderDto>();
        }
    }
}
