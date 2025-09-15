using ChocoBean.BusinessLogic.Interfaces;
using ChocoBean.DTO;
using ChocoBean.DataAccess.Context;
using ChocoBean.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChocoBean.BusinessLogic.Services
{
    public class AuthService : IAuthService
    {
        private readonly ChocoBeanDbContext _db;
        private readonly IConfiguration _config;

        public AuthService(ChocoBeanDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        public async Task<AuthResultDto> RegisterAsync(RegisterDto registerDto)
        {
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            if (existingUser != null)
                throw new Exception("User with this email already exists.");

            var user = new User
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                IsAdmin = false
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new AuthResultDto
            {
                Token = token,
                User = new DTO.UserDto
                {
                    Id = user.UserId,
                    Email = user.Email,
                    UserName = user.UserName
                }
            };
        }

        public async Task<AuthResultDto> Login(LoginDto loginDto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                throw new Exception("Invalid email or password.");

            var token = GenerateJwtToken(user);

            return new AuthResultDto
            {
                Token = token,
                User = new DTO.UserDto
                {
                    Id = user.UserId,
                    Email = user.Email,
                    UserName = user.UserName
                }
            };
        }

        private string GenerateJwtToken(User user)
        {
            var keyStr = _config["Jwt:Key"] ?? throw new ArgumentNullException("JWT Key missing");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? string.Empty),
                new Claim("userId", user.UserId.ToString())
            };

            if (user.IsAdmin)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Admin"));
            }

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
