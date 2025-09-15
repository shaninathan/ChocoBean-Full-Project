using ChocoBean.DataAccess.Entities;

namespace ChocoBean.DataAccess.Interfaces;

public interface IProductRepository
{
    Task<List<Product>> GetAll();
    Task<Product?> GetById(int productId);
}
