namespace ChocoBean.DTO;

public class RegisterDto
{
    public string UserName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class LoginDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class AuthResultDto
{
    public string Token { get; set; } = null!;
    public UserDto User { get; set; } = null!;
}
