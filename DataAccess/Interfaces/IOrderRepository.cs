using ChocoBean.DataAccess.Entities;

namespace ChocoBean.DataAccess.Interfaces;

public interface IOrderRepository
{
    Task<Order> Add(Order order);
    Task<List<Order>> GetUserOrders(int userId);
    Task<Order?> GetById(int orderId, int userId);
    Task Delete(Order order);
}
