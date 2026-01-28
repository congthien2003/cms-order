using Application.Features.Dashboard.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Host.Controllers;

/// <summary>
/// Controller for Dashboard & Statistics
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Get dashboard summary (today's stats, pending orders, comparison with yesterday)
    /// </summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetDashboardSummaryQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get revenue statistics for a date range
    /// </summary>
    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetRevenueStatisticsQuery(fromDate, toDate), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get orders count by status
    /// </summary>
    [HttpGet("orders-by-status")]
    public async Task<IActionResult> GetOrdersByStatus(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetOrdersByStatusQuery(fromDate, toDate), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get top selling products
    /// </summary>
    [HttpGet("top-products")]
    public async Task<IActionResult> GetTopProducts(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        [FromQuery] int top = 10,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetTopProductsQuery(fromDate, toDate, top), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get revenue by category
    /// </summary>
    [HttpGet("revenue-by-category")]
    public async Task<IActionResult> GetRevenueByCategory(
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetRevenueByCategoryQuery(fromDate, toDate), cancellationToken);
        return Ok(result);
    }
}
