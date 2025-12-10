using Application.Features.Authentication.Commands;
using Application.Models.Authentication.Request;
using Asp.Versioning;
using Host.Controllers.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Host.Controllers
{
    [ApiController]
    [ApiVersion(1)]
    [Route("api/v{v:apiVersion}/authentication")]
    public class AuthenticationController : BaseController
    {
        private readonly ILogger<AuthenticationController> _logger;
        
        public AuthenticationController(ILogger<AuthenticationController> logger)
        {
            _logger = logger;
        }

        [HttpGet("ping")]
        [Authorize(Roles = "Admin, User")]
        public IActionResult Ping()
        {
            _logger.LogInformation("Ping received at {Time}", DateTime.UtcNow);
            return Ok("Pong");
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequest request, CancellationToken cancellationToken)
        {
            var command = new LoginCommand(request);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequest request, CancellationToken cancellationToken)
        {
            var command = new RegisterCommand(request);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        } 
    }
}
