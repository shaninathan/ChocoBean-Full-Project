using ChocoBean.DataAccess.Entities;

namespace ChocoBean.DataAccess.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmail(string email);
    Task<User?> GetById(int id);
    Task<bool> EmailExists(string email);
    Task<bool> UserNameExists(string userName);
    Task<User> Add(User user);
    Task Update(User user);
    Task Remove(User user);
    Task<List<User>> GetAll(); 


}
