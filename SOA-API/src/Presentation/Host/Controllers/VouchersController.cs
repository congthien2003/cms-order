using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Features.Vouchers.Commands;
using Application.Features.Vouchers.Models;
using Application.Features.Vouchers.Queries;

namespace Host.Controllers;

[ApiController]
[Route("api/v{v:apiVersion}/vouchers")]
public class VouchersController : ControllerBase
{
    private readonly IMediator _mediator;

    public VouchersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get list of vouchers with optional filters
    /// </summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetVouchers(
        [FromQuery] bool? isActive = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] bool? onlyValid = null,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = new GetVouchersListQuery(isActive, searchTerm, onlyValid, pageNumber, pageSize);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get voucher by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetVoucherById(Guid id)
    {
        var query = new GetVoucherByIdQuery(id);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Validate a voucher code for an order
    /// </summary>
    [HttpPost("validate")]
    [AllowAnonymous]
    public async Task<IActionResult> ValidateVoucher([FromBody] ValidateVoucherRequest request)
    {
        var query = new ValidateVoucherQuery(request.Code, request.OrderAmount);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Create a new voucher
    /// </summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateVoucher([FromBody] CreateVoucherRequest request)
    {
        var command = new CreateVoucherCommand(request);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(
            nameof(GetVoucherById),
            new { id = result.Data?.Id },
            result
        );
    }

    /// <summary>
    /// Update an existing voucher
    /// </summary>
    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateVoucher(Guid id, [FromBody] UpdateVoucherRequest request)
    {
        var command = new UpdateVoucherCommand(id, request);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Delete a voucher
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteVoucher(Guid id)
    {
        var command = new DeleteVoucherCommand(id);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Toggle voucher active status
    /// </summary>
    [HttpPatch("{id:guid}/toggle-status")]
    [Authorize]
    public async Task<IActionResult> ToggleVoucherStatus(Guid id)
    {
        var command = new ToggleVoucherStatusCommand(id);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
