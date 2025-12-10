using ibancollection.Shared.Auths;
using Microsoft.AspNetCore.Authorization;

namespace Infrastructures.Authentication
{
    /// <summary>
    /// Authorization attribute that requires the specified permission
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public sealed class HavePermissionAttribute : AuthorizeAttribute
    {
        /// <summary>
        /// Constructor that accepts action and resource to create a permission policy
        /// </summary>
        /// <param name="action">The action (e.g., View, Create)</param>
        /// <param name="resource">The resource (e.g., Users, Roles)</param>
        public HavePermissionAttribute(string action, string resource) =>
            Policy = AppPermission.NameFor(action, resource);
    }
}

