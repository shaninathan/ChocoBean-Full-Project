using ChocoBean.BusinessLogic.Services;
using ChocoBean.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ChocoBean.BusinessLogic.Interfaces;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _service;

    public MessagesController(IMessageService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Send([FromBody] MessageDto dto)
    {
        var result = await _service.SendMessage(dto);
        return Ok(result);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserMessages(int userId)
    {
        var msgs = await _service.GetUserMessages(userId);
        return Ok(msgs);
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdminMessages()
    {
        var msgs = await _service.GetAdminMessages();
        return Ok(msgs);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkRead(int id)
    {
        await _service.MarkAsRead(id);
        return Ok();
    }
}
