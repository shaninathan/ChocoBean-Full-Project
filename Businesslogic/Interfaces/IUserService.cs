using ChocoBean.DTO;

namespace ChocoBean.BusinessLogic.Interfaces;

public interface IUserService
{
    Task<UserDto?> GetById(int userId);
    Task<UserProfileDto?> GetProfile(int userId);
    Task<UserProfileDto> UpsertProfile(int userId, UserProfileDto profile);
    Task DeleteUser(int userId);

    Task<List<UserDto>> GetAll();

    Task<UserDto> UpdateStatus(int userId, string status);
}