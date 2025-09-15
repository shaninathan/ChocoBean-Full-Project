using AutoMapper;
using ChocoBean.DTO;
using ChocoBean.DataAccess.Entities;

namespace ChocoBean.Api.Mapping;

public class ApiMappingProfile : Profile
{
    public ApiMappingProfile()
    {
        // Register / Login
        CreateMap<RegisterDto, RegisterDto>().ReverseMap();
        CreateMap<LoginDto, LoginDto>().ReverseMap();

        // User profile
        CreateMap<UserProfileDto, UserProfileDto>().ReverseMap();

        // Orders
        CreateMap<OrderItemDto, OrderItem>()
            .ForMember(dest => dest.Product, opt => opt.Ignore()) 
            .ReverseMap()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
            .ForMember(dest => dest.ProductDescription, opt => opt.MapFrom(src => src.Product.Description));

        CreateMap<OrderDto, Order>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse<OrderStatus>(src.Status)));

        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName));

       CreateMap<User, UserDto>()
    .ForMember(d => d.Id, opt => opt.MapFrom(s => s.UserId))
    .ReverseMap();

    }
}
