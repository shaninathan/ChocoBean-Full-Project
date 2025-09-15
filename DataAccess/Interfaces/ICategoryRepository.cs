using ChocoBean.DataAccess.Entities;

namespace ChocoBean.DataAccess.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAll();
}
