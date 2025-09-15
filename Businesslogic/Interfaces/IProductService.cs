using ChocoBean.DTO;

namespace ChocoBean.BusinessLogic.Interfaces;

public interface IProductService
{
    Task<List<ProductDto>> GetAll();
    Task<ProductDto?> GetById(int id);
}

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAll();
}

public interface IOrderService
{
    Task<OrderDto> CreateOrder(int userId, OrderDto order);
    Task<List<OrderDto>> GetMyOrders(int userId);
    Task DeleteOrder(int userId, int orderId);
}
