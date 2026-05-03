using Application.Models.Common;
using Application.Services.Interfaces;
using Asp.Versioning;
using Host.Controllers.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Host.Controllers
{
    [ApiController]
    [ApiVersion(1)]
    [Route("api/v{v:apiVersion}/error-logs")]
    [Authorize(Roles = "Admin")]
    public class ErrorLogsController : BaseController
    {
        private readonly IErrorLogService _errorLogService;

        public ErrorLogsController(IErrorLogService errorLogService)
        {
            _errorLogService = errorLogService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPagedAsync([FromQuery] ErrorLogQueryParameters parameters, CancellationToken cancellationToken)
        {
            var result = await _errorLogService.GetPagedAsync(parameters, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            var result = await _errorLogService.GetByIdAsync(id, cancellationToken);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
