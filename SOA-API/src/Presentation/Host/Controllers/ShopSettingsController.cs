using Application.Features.ShopSettings.Commands;
using Application.Features.ShopSettings.Models;
using Application.Features.ShopSettings.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Host.Controllers
{
    /// <summary>
    /// Shop Settings management endpoints
    /// </summary>
    [ApiController]
    [Route("api/v{v:apiVersion}/shop-settings")]
    public class ShopSettingsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ShopSettingsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get shop settings
        /// </summary>
        /// <returns>Shop settings information</returns>
        [HttpGet]
        [ProducesResponseType(typeof(ShopSettingsResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetShopSettings()
        {
            var query = new GetShopSettingsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Update shop information
        /// </summary>
        /// <param name="request">Shop information to update</param>
        /// <returns>Updated shop settings</returns>
        [HttpPut("info")]
        [Authorize]
        [ProducesResponseType(typeof(ShopSettingsResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateShopInfo([FromBody] UpdateShopInfoRequest request)
        {
            var command = new UpdateShopInfoCommand(request);
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        /// <summary>
        /// Update VAT settings
        /// </summary>
        /// <param name="request">VAT settings to update</param>
        /// <returns>Updated shop settings</returns>
        [HttpPut("vat")]
        [Authorize]
        [ProducesResponseType(typeof(ShopSettingsResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateVATSettings([FromBody] UpdateVATSettingsRequest request)
        {
            var command = new UpdateVATSettingsCommand(request);
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        /// <summary>
        /// Update receipt footer
        /// </summary>
        /// <param name="request">Receipt footer to update</param>
        /// <returns>Updated shop settings</returns>
        [HttpPut("receipt-footer")]
        [Authorize]
        [ProducesResponseType(typeof(ShopSettingsResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateReceiptFooter([FromBody] UpdateReceiptFooterRequest request)
        {
            var command = new UpdateReceiptFooterCommand(request);
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
