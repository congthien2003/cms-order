using Application.Features.Settings.Commands;
using Application.Features.Settings.Models;
using Application.Features.Settings.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Host.Controllers;

/// <summary>
/// Controller for Shop Settings
/// </summary>
[ApiController]
[Route("api/v{v:apiVersion}/settings")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SettingsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get shop settings
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetSettings(CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetShopSettingsQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Update shop settings
    /// </summary>
    [HttpPut]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateShopSettingsRequest request, CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new UpdateShopSettingsCommand(request), cancellationToken);
        return Ok(result);
    }
}
