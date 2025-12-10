using Application.Features.Users.Commands;
using Application.Features.Users.Queries;
using Application.Models.Authentication.Request;
using Application.Models.Common;
using Application.Models.User.Request;
using Application.Models.User.Response;
using Asp.Versioning;
using Host.Controllers.Base;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Host.Controllers
{
    [ApiController]
    [ApiVersion(1)]
    [Route("api/v{v:apiVersion}/users")]
    public class UserController : BaseController
    {

        /// <summary>
        /// Lấy thông tin user theo Id
        /// </summary>
        /// <param name="id">Id của user</param>
        /// <param name="cancellationToken"></param>
        /// <returns>UserInfoResponse</returns>
        [ProducesResponseType(typeof(Result<UserInfoResponse>), 200)]
        [ProducesResponseType(404)]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetUserByIdQuery(id);
            var result = await Mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Lấy thông tin user theo username
        /// </summary>
        /// <param name="username">Tên đăng nhập</param>
        /// <param name="cancellationToken"></param>
        /// <returns>UserInfoResponse</returns>
        [ProducesResponseType(typeof(Result<UserInfoResponse>), 200)]
        [ProducesResponseType(404)]
        [HttpGet("by-username/{username}")]
        public async Task<IActionResult> GetByUsername(string username, CancellationToken cancellationToken)
        {
            var query = new GetUserByUsernameQuery(username);
            var result = await Mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Lấy danh sách user có phân trang, tìm kiếm, sắp xếp
        /// </summary>
        /// <param name="request">Tham số phân trang, tìm kiếm, sắp xếp</param>
        /// <param name="cancellationToken"></param>
        /// <returns>PagedResult<UserInfoResponse></returns>
        [ProducesResponseType(typeof(Result<PagedResult<UserInfoResponse>>), 200)]
        [HttpPost("list")]
        public async Task<IActionResult> GetListWithPagination([FromBody] GetListParameters request, CancellationToken cancellationToken)
        {
            var query = new GetUsersListQuery(request);
            var result = await Mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Tạo mới user
        /// </summary>
        /// <param name="request">Thông tin user cần tạo</param>
        /// <param name="cancellationToken"></param>
        /// <returns>Id user vừa tạo</returns>
        [ProducesResponseType(typeof(Result<Guid>), 200)]
        [ProducesResponseType(400)]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest request, CancellationToken cancellationToken)
        {
            var command = new CreateUserCommand(request);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Cập nhật user
        /// </summary>
        /// <param name="id">Id user</param>
        /// <param name="request">Thông tin cập nhật</param>
        /// <param name="cancellationToken"></param>
        /// <returns>True nếu thành công</returns>
        [ProducesResponseType(typeof(Result<bool>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
        {
            var command = new UpdateUserCommand(id, request);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Xóa user
        /// </summary>
        /// <param name="id">Id user</param>
        /// <param name="cancellationToken"></param>
        /// <returns>True nếu thành công</returns>
        [ProducesResponseType(typeof(Result<bool>), 200)]
        [ProducesResponseType(404)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var command = new DeleteUserCommand(id);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Đổi mật khẩu user
        /// </summary>
        /// <param name="id">Id user</param>
        /// <param name="request">Thông tin đổi mật khẩu</param>
        /// <param name="cancellationToken"></param>
        /// <returns>True nếu thành công</returns>
        [ProducesResponseType(typeof(Result<bool>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [HttpPost("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordRequest request, CancellationToken cancellationToken)
        {
            var command = new ChangePasswordCommand(id, request);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Gán role cho user
        /// </summary>
        /// <param name="id">Id user</param>
        /// <param name="roleId">Id role</param>
        /// <param name="cancellationToken"></param>
        /// <returns>True nếu thành công</returns>
        [ProducesResponseType(typeof(Result<bool>), 200)]
        [ProducesResponseType(404)]
        [HttpPost("{id}/assign-role")]
        public async Task<IActionResult> AssignRole(Guid id, [FromQuery] Guid roleId, CancellationToken cancellationToken)
        {
            var command = new AssignRoleCommand(id, roleId);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Xóa role khỏi user
        /// </summary>
        /// <param name="id">Id user</param>
        /// <param name="roleId">Id role</param>
        /// <param name="cancellationToken"></param>
        /// <returns>True nếu thành công</returns>
        [ProducesResponseType(typeof(Result<bool>), 200)]
        [ProducesResponseType(404)]
        [HttpPost("{id}/remove-role")]
        public async Task<IActionResult> RemoveRole(Guid id, [FromQuery] Guid roleId, CancellationToken cancellationToken)
        {
            var command = new RemoveRoleCommand(id, roleId);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Vô hiệu hóa user
        /// </summary>
        /// <param name="id">Id user</param>
        /// <param name="cancellationToken"></param>
        /// <returns>True nếu thành công</returns>
        [ProducesResponseType(typeof(Result<bool>), 200)]
        [ProducesResponseType(404)]
        [HttpPost("{id}/deactivate")]
        public async Task<IActionResult> Deactivate(Guid id, CancellationToken cancellationToken)
        {
            var command = new DeactivateUserCommand(id);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Kích hoạt user
        /// </summary>
        /// <param name="id">Id user</param>
        /// <param name="cancellationToken"></param>
        /// <returns>True nếu thành công</returns>
        [ProducesResponseType(typeof(Result<bool>), 200)]
        [ProducesResponseType(404)]
        [HttpPost("{id}/activate")]
        public async Task<IActionResult> Activate(Guid id, CancellationToken cancellationToken)
        {
            var command = new ActivateUserCommand(id);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
    }
}
