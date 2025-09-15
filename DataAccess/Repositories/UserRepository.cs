using ChocoBean.DataAccess.Context;
using ChocoBean.DataAccess.Entities;
using ChocoBean.DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace ChocoBean.DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ChocoBeanDbContext _context;

        public UserRepository(ChocoBeanDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetById(int userId)
        {
            return await _context.Users.Include(u => u.Profile)
                                       .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<User?> GetByEmail(string email)
        {
            return await _context.Users.Include(u => u.Profile)
                                       .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> Add(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }


        public async Task Update(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task Remove(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EmailExists(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> UserNameExists(string userName)
        {
            return await _context.Users.AnyAsync(u => u.UserName == userName);
        }

        public async Task<List<User>> GetAll()
        {
            return await _context.Users
                .Include(u => u.Profile)
                .Include(u => u.Orders)
                .ToListAsync();
        }

    }
}
