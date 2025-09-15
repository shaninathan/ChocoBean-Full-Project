using ChocoBean.DataAccess.Context;
using ChocoBean.DataAccess.Entities;
using ChocoBean.DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ChocoBean.DataAccess.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly ChocoBeanDbContext _ctx;
    public CategoryRepository(ChocoBeanDbContext ctx) => _ctx = ctx;

    public Task<List<Category>> GetAll() =>
        _ctx.Categories.AsNoTracking().ToListAsync();
}
