using System.Collections.ObjectModel;

namespace ibancollection.Shared.Auths;

public static class AppAction
{
    public const string View = nameof(View);
    public const string Search = nameof(Search);
    public const string Create = nameof(Create);
    public const string Update = nameof(Update);
    public const string Delete = nameof(Delete);
    public const string Clone = nameof(Clone);
    public const string Draft = nameof(Draft);
    public const string Export = nameof(Export);
    public const string Approve = nameof(Approve);
    public const string Reject = nameof(Reject);
    public const string Executed = nameof(Executed);
}

public static class AppResource
{
    // Identity resources
    public const string Users = nameof(Users);
    public const string UserRoles = nameof(UserRoles);
    public const string Roles = nameof(Roles);
    public const string RoleClaims = nameof(RoleClaims);

    // Feature resources
    public const string Banks = nameof(Banks);

}

public static class AppPermissions
{
    private static readonly AppPermission[] _all =
    [
        // Identity permissions
        new("View Users", AppAction.View, AppResource.Users),
        new("Search Users", AppAction.Search, AppResource.Users, IsBasic: true),
        new("Create Users", AppAction.Create, AppResource.Users),
        new("Update Users", AppAction.Update, AppResource.Users),
        new("Delete Users", AppAction.Delete, AppResource.Users),

        new("View UserRoles", AppAction.View, AppResource.UserRoles),
        new("Update UserRoles", AppAction.Update, AppResource.UserRoles),

        new("View Roles", AppAction.View, AppResource.Roles),
        new("Search Roles", AppAction.Search, AppResource.Roles),
        new("Create Roles", AppAction.Create, AppResource.Roles),
        new("Update Roles", AppAction.Update, AppResource.Roles),
        new("Delete Roles", AppAction.Delete, AppResource.Roles),

        new("View RoleClaims", AppAction.View, AppResource.RoleClaims),
        new("Update RoleClaims", AppAction.Update, AppResource.RoleClaims),
        
        // Feature permissions
        new("View Banks", AppAction.View, AppResource.Banks, IsBasic: true),
        new("Search Banks", AppAction.Search, AppResource.Banks, IsBasic: true),
        new("Create Banks", AppAction.Create, AppResource.Banks),
        new("Update Banks", AppAction.Update, AppResource.Banks),
        new("Delete Banks", AppAction.Delete, AppResource.Banks),

    ];

    public static IReadOnlyList<AppPermission> All { get; } = new ReadOnlyCollection<AppPermission>(_all);
    public static IReadOnlyList<AppPermission> Admin { get; } = new ReadOnlyCollection<AppPermission>(_all.Where(p => !p.IsRoot).ToArray());
}

public record AppPermission(string Description, string Action, string Resource, bool IsBasic = false, bool IsRoot = false)
{
    public string Name => NameFor(Action, Resource);
    public static string NameFor(string action, string resource) => $"{resource}.{action}";
}