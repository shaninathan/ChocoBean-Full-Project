using AutoMapper;
using ChocoBean.DataAccess.Entities;
using ChocoBean.DTO;
using System;

namespace ChocoBean.BusinessLogic.Mapping
{
    public class BusinessMappingProfile : Profile
    {
        public BusinessMappingProfile()
        {
            // Users
            CreateMap<User, UserDto>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.UserId))
                .ReverseMap()
                .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Id));

            // Profiles
            CreateMap<UserProfile, UserProfileDto>().ReverseMap();

            // Catalog
            CreateMap<Category, CategoryDto>().ReverseMap();
            CreateMap<Product, ProductDto>().ReverseMap();

            // Order Items
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, opt => opt.MapFrom(s => s.ProductId))
                .ForMember(d => d.ProductName, opt => opt.MapFrom(s => s.Product.ProductName))
                .ForMember(d => d.ProductDescription, opt => opt.MapFrom(s => s.Product.Description))
                .ForMember(d => d.Quantity, opt => opt.MapFrom(s => s.Quantity))
                .ForMember(d => d.Price, opt => opt.MapFrom(s => s.Price))
                .ForSourceMember(s => s.Product, opt => opt.DoNotValidate());

            // Orders
            CreateMap<Order, OrderDto>()
                .ForMember(d => d.Items, opt => opt.MapFrom(s => s.Items))
                .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.UserId))
                .ForMember(d => d.UserName, opt => opt.MapFrom(s => s.User.UserName))
                .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status.ToString())) // המרה ל-string
                .ReverseMap()
                .ForMember(d => d.User, opt => opt.Ignore())
                .ForMember(d => d.Items, opt => opt.Ignore())
                .ForMember(d => d.Status, opt => opt.MapFrom(s => Enum.Parse<OrderStatus>(s.Status))); // חזרה ל-Enum

            CreateMap<Message, MessageDto>().ReverseMap();

        }

    }
}
