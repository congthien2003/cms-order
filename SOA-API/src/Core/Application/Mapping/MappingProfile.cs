using Domain.Identity;
using Domain.Entities;
using Mapster;
using Application.Models.Role;
using Application.Models.User.Response;
using Application.Features.ShopSettings.Models;
using Application.Features.Toppings.Models;
using Application.Features.Vouchers.Models;

namespace Application.Mapping
{

    public static class MapsterConfig
    {
        public static void RegisterMappings()
        {
            // User mappings
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

            // ShopSettings mappings
            TypeAdapterConfig<ShopSetting, ShopSettingsResponse>.NewConfig()
                .Map(dest => dest.CreatedDate, src => src.CreatedAt)
                .Map(dest => dest.ModifiedDate, src => src.UpdatedAt);

            // Topping mappings
            TypeAdapterConfig<Topping, ToppingResponse>.NewConfig()
                .Map(dest => dest.CreatedDate, src => src.CreatedAt)
                .Map(dest => dest.ModifiedDate, src => src.UpdatedAt);

            TypeAdapterConfig<CreateToppingRequest, Topping>.NewConfig()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.UpdatedAt)
                .Ignore(dest => dest.CreatedById)
                .Ignore(dest => dest.UpdatedById)
                .Ignore(dest => dest.IsDeleted)
                .Ignore(dest => dest.ProductToppings)
                .Map(dest => dest.IsActive, src => true);

            TypeAdapterConfig<UpdateToppingRequest, Topping>.NewConfig()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.IsActive)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.UpdatedAt)
                .Ignore(dest => dest.CreatedById)
                .Ignore(dest => dest.UpdatedById)
                .Ignore(dest => dest.IsDeleted)
                .Ignore(dest => dest.ProductToppings);

            // Voucher mappings
            TypeAdapterConfig<Voucher, VoucherResponse>.NewConfig()
                .Map(dest => dest.CreatedDate, src => src.CreatedAt)
                .Map(dest => dest.ModifiedDate, src => src.UpdatedAt);

            TypeAdapterConfig<CreateVoucherRequest, Voucher>.NewConfig()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.UsedCount)
                .Ignore(dest => dest.IsActive)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.UpdatedAt)
                .Ignore(dest => dest.CreatedById)
                .Ignore(dest => dest.UpdatedById)
                .Ignore(dest => dest.IsDeleted)
                .Ignore(dest => dest.Orders);

            TypeAdapterConfig<UpdateVoucherRequest, Voucher>.NewConfig()
                .Ignore(dest => dest.Id)
                .Ignore(dest => dest.Code)
                .Ignore(dest => dest.UsedCount)
                .Ignore(dest => dest.IsActive)
                .Ignore(dest => dest.CreatedAt)
                .Ignore(dest => dest.UpdatedAt)
                .Ignore(dest => dest.CreatedById)
                .Ignore(dest => dest.UpdatedById)
                .Ignore(dest => dest.IsDeleted)
                .Ignore(dest => dest.Orders);
        }
    }
}
