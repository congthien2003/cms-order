
using Domain.Identity;
using Application.Services.Interfaces.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Filters;
using Application.Exceptions;


namespace JONE02.Application.ActionFilters
{
    public class ValidationUserStatus : IActionFilter
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly UserManager<User> _userManager;
        public ValidationUserStatus(ICurrentUserService currentUserService, UserManager<User> userManager)
        {
            _currentUserService = currentUserService;
            _userManager = userManager;
        }
        public void OnActionExecuted(ActionExecutedContext context)
        {

        }

        /// <summary>
        /// Check if user is active before executing the action
        /// </summary>
        /// <param name="context"></param>
        /// <exception cref="NotFoundException"></exception>
        /// <exception cref="ForbiddenException"></exception>
        public void OnActionExecuting(ActionExecutingContext context)
        {
            var userId = _currentUserService.CurrentUser.Id;

            var user = _userManager.Users.FirstOrDefault(x => x.Id == userId);

            if (user == null)
            {
                throw new NotFoundException("Không tìm thấy người dùng", "USER-NOT-FOUND");
            }

            if (!user.IsActive)
            {
                throw new ForbiddenException("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị.", "USER-WAS-BLOCKED");
            }
        }
    }
}
