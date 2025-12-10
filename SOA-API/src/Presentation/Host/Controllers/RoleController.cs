using Application.Features.Roles.Commands;
using Application.Features.Roles.Queries;
using Application.Models.Common;
using Application.Models.Role;
using Asp.Versioning;
using Host.Controllers.Base;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Host.Controllers
{
    [ApiController]
    [ApiVersion(1)]
    [Route("api/v{v:apiVersion}/roles")]
    public class RoleController : BaseController
    {
        /// <summary>
        /// Lấy thông tin role theo Id
        /// </summary>
        /// <param name="id">Id của role</param>
        /// <param name="cancellationToken"></param>
        /// <returns>RoleInfoResponse</returns>
        [ProducesResponseType(typeof(Result<RoleInfoResponse>), 200)]
        [ProducesResponseType(404)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetRoleByIdQuery(id);
            var result = await Mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Lấy thông tin role theo tên
        /// </summary>
        /// <param name="roleName">Tên role</param>
        /// <param name="cancellationToken"></param>
        /// <returns>RoleInfoResponse</returns>
        [ProducesResponseType(typeof(Result<RoleInfoResponse>), 200)]
        [ProducesResponseType(404)]
        [HttpGet("by-name/{roleName}")]
        public async Task<IActionResult> GetByName(string roleName, CancellationToken cancellationToken)
        {
            var query = new GetRoleByNameQuery(roleName);
            var result = await Mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Lấy danh sách role có phân trang, tìm kiếm, sắp xếp
        /// </summary>
        /// <param name="request">Tham số phân trang, tìm kiếm, sắp xếp</param>
        /// <param name="cancellationToken"></param>
        /// <returns>PagedResult<RoleInfoResponse></returns>
        [ProducesResponseType(typeof(Result<PagedResult<RoleInfoResponse>>), 200)]
        [HttpPost("list")]
        public async Task<IActionResult> GetListWithPagination([FromBody] GetListParameters request, CancellationToken cancellationToken)
        {
            var query = new GetRolesListQuery(request);
            var result = await Mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Tạo mới role
        /// </summary>
        /// <param name="request">Thông tin role cần tạo</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Id role vừa tạo</returns>
        [ProducesResponseType(typeof(Result<Guid>), 200)]
        [ProducesResponseType(400)]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRoleRequest request, CancellationToken cancellationToken)
        {
            var command = new CreateRoleCommand(request);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Cập nhật role
        /// </summary>
        /// <param name="id">Id role</param>
        /// <param name="request">Thông tin cập nhật</param>
        /// <param name="cancellationToken"></param>
        /// <returns>True nếu thành công</returns>
        [ProducesResponseType(typeof(Result<bool>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRoleRequest request, CancellationToken cancellationToken)
        {
            var command = new UpdateRoleCommand(id, request);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Xóa role
        /// </summary>
        /// <param name="id">Id role</param>
        /// <param name="cancellationToken"></param>
        /// <returns>True nếu thành công</returns>
        [ProducesResponseType(typeof(Result<bool>), 200)]
        [ProducesResponseType(404)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var command = new DeleteRoleCommand(id);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
    }
}
