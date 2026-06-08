using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.DTOs.Categories;
using StockManager.Domain.Interfaces.Repositories;

namespace StockManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoriesController(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetAllAsync(cancellationToken);

        var result = categories
            .OrderBy(x => x.Name)
            .Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name
            });

        return Ok(result);
    }
}
