using ChocoBean.DataAccess.Context;
using ChocoBean.DataAccess.Entities;
using ChocoBean.DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChocoBean.DataAccess.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ChocoBeanDbContext _ctx;
    public ProductRepository(ChocoBeanDbContext ctx) => _ctx = ctx;

    public Task<List<Product>> GetAll() =>
        _ctx.Products.AsNoTracking().ToListAsync();

    public Task<Product?> GetById(int productId) =>
        _ctx.Products.AsNoTracking().FirstOrDefaultAsync(p => p.ProductId == productId);
}
