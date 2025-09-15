using ChocoBean.BusinessLogic.Interfaces;
using ChocoBean.DTO;
using Microsoft.AspNetCore.Mvc;

namespace ChocoBean.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth)
        {
            _auth = auth;
        }

        [HttpPost("signup")]
        public async Task<ActionResult<AuthResultDto>> Register([FromBody] RegisterDto request)
        {
            try
            {
                var result = await _auth.RegisterAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResultDto>> Login([FromBody] LoginDto request)
        {
            try
            {
                var result = await _auth.Login(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}