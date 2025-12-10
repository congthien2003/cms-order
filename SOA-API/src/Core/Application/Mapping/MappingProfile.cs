using Domain.Identity;
using Mapster;
using Application.Models.Role;
using Application.Models.User.Response;

namespace Application.Mapping
{

    public static class MapsterConfig
    {
        public static void RegisterMappings()
        {
            TypeAdapterConfig<User, UserInfoResponse>.NewConfig()
                .Map(dest => dest.FullName, src => $"{src.UserName} {src.PhoneNumber}")
                .Map(dest => dest.Roles, src => src.Roles.Select(x => x.Name).ToArray());

            TypeAdapterConfig<User, UserDetailResponse>.NewConfig()
                .Map(dest => dest.FullName, src => $"{src.UserName} {src.PhoneNumber}")
                .Map(dest => dest.Roles, src => src.Roles.ToArray());

            TypeAdapterConfig<Role, RoleInfoResponse>.NewConfig()
                .Map(dest => dest.Id, src => src.Id)
                .Map(dest => dest.Name, src => src.Name)
                .Map(dest => dest.Description, src => src.Description);
        }
    }
}
