using AutoMapper;
using ChocoBean.BusinessLogic.Interfaces;
using ChocoBean.DataAccess.Entities;
using ChocoBean.DataAccess.Interfaces;
using ChocoBean.DTO;

namespace ChocoBean.BusinessLogic.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _users;
    private readonly IMapper _mapper;

    public UserService(IUserRepository users, IMapper mapper)
    {
        _users = users;
        _mapper = mapper;
    }

    public async Task<UserDto?> GetById(int userId)
    {
        var u = await _users.GetById(userId);
        return u is null ? null : _mapper.Map<UserDto>(u);
    }

    public async Task<UserProfileDto?> GetProfile(int userId)
    {
        var u = await _users.GetById(userId);
        return u?.Profile is null ? null : _mapper.Map<UserProfileDto>(u.Profile);
    }

    public async Task<UserProfileDto> UpsertProfile(int userId, UserProfileDto profile)
    {
        var u = await _users.GetById(userId) ?? throw new Exception("User not found");

        if (u.Profile == null)
            u.Profile = _mapper.Map<UserProfile>(profile);
        else
            _mapper.Map(profile, u.Profile);

        await _users.Update(u);
        return _mapper.Map<UserProfileDto>(u.Profile);
    }

    public async Task DeleteUser(int userId)
    {
        var u = await _users.GetById(userId) ?? throw new Exception("User not found");
        await _users.Remove(u); // מחיקה פיזית מהטבלה
    }
    public async Task<List<UserDto>> GetAll()
    {
        var users = await _users.GetAll();
        return _mapper.Map<List<UserDto>>(users);
    }

    public async Task<UserDto> UpdateStatus(int userId, string status)
    {
        var user = await _users.GetById(userId) ?? throw new Exception("User not found");
        user.Status = status; // צריך להוסיף שדה Status ל-User entity
        await _users.Update(user);
        return _mapper.Map<UserDto>(user);
    }
}
