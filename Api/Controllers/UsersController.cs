using ChocoBean.BusinessLogic.Interfaces;
using ChocoBean.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChocoBean.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _users;

    public UsersController(IUserService users)
    {
        _users = users;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        var u = await _users.GetById(id);
        if (u is null) return NotFound();
        return Ok(u);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _users.DeleteUser(id);
        return Ok();
    }

    [HttpGet("{id:int}/profile")]
    public async Task<ActionResult<UserProfileDto>> GetProfile(int id)
    {
        var p = await _users.GetProfile(id);

        // 🔄 במקום NotFound – נחזיר DTO ריק
        if (p is null)
            return Ok(new UserProfileDto());

        return Ok(p);
    }

    [HttpPost("{id:int}/profile")]
    public async Task<ActionResult<UserProfileDto>> UpsertProfile(int id, [FromBody] UserProfileDto profile)
    {
        var saved = await _users.UpsertProfile(id, profile);
        return Ok(saved);
    }

    // ✅ חדש: קבלת כל המשתמשים (לאדמין)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _users.GetAll();
        return Ok(users);
    }

    // ✅ חדש: עדכון סטטוס משתמש
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var user = await _users.UpdateStatus(id, status);
        return Ok(user);
    }
}
