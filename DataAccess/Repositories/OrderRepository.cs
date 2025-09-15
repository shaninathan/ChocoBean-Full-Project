using ChocoBean.DataAccess.Context;
using ChocoBean.DataAccess.Entities;
using ChocoBean.DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChocoBean.DataAccess.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly ChocoBeanDbContext _ctx;
    public OrderRepository(ChocoBeanDbContext ctx) => _ctx = ctx;

    public async Task<Order> Add(Order order)
    {
        _ctx.Orders.Add(order);
        await _ctx.SaveChangesAsync();
        return order;
    }

    public Task<List<Order>> GetUserOrders(int userId) =>
        _ctx.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

    public Task<Order?> GetById(int orderId, int userId) =>
        _ctx.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.OrderId == orderId && o.UserId == userId);

    public async Task Delete(Order order)
    {
        _ctx.Orders.Remove(order);
        await _ctx.SaveChangesAsync();
    }
}
