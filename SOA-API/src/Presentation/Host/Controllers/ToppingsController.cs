using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Features.Toppings.Commands;
using Application.Features.Toppings.Models;
using Application.Features.Toppings.Queries;

namespace Host.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToppingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ToppingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get list of toppings with optional filters
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetToppings(
        [FromQuery] bool? isActive = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = new GetToppingsListQuery(isActive, searchTerm, pageNumber, pageSize);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get topping by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetToppingById(Guid id)
    {
        var query = new GetToppingByIdQuery(id);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Create a new topping
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateTopping([FromBody] CreateToppingRequest request)
    {
        var command = new CreateToppingCommand(request);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(
            nameof(GetToppingById),
            new { id = result.Data?.Id },
            result
        );
    }

    /// <summary>
    /// Update an existing topping
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateTopping(Guid id, [FromBody] UpdateToppingRequest request)
    {
        var command = new UpdateToppingCommand(id, request);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Delete a topping
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteTopping(Guid id)
    {
        var command = new DeleteToppingCommand(id);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Toggle topping active status
    /// </summary>
    [HttpPatch("{id:guid}/toggle-status")]
    [Authorize]
    public async Task<IActionResult> ToggleToppingStatus(Guid id)
    {
        var command = new ToggleToppingStatusCommand(id);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
