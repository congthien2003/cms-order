using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Webhook.Controllers
{
    [Route("webhook")]
    [ApiController]
    public class Webhook : ControllerBase
    {
        [HttpGet("health-check")]
        public IActionResult Get()
        {
            return Ok("Webhook is working!");
        }
    }
}
