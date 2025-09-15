using ChocoBean.DTO;

namespace ChocoBean.BusinessLogic.Interfaces;

public interface IAuthService
{
    Task<AuthResultDto> RegisterAsync(RegisterDto registerDto);
    Task<AuthResultDto> Login(LoginDto loginDto);
}
