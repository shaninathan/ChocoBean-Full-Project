using ChocoBean.BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChocoBean.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _svc;
    public ProductsController(IProductService svc) { _svc = svc; }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _svc.GetAll());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _svc.GetById(id);
        return p is null ? NotFound() : Ok(p);
    }
}

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _svc;
    public CategoriesController(ICategoryService svc) { _svc = svc; }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _svc.GetAll());
}
