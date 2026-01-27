using Application.Features.ShopSettings.Models;
using AutoMapper;
using Domain.Entities;

namespace Application.Features.ShopSettings.Mapping
{
    public class ShopSettingsMappingProfile : Profile
    {
        public ShopSettingsMappingProfile()
        {
            CreateMap<ShopSetting, ShopSettingsResponse>();
        }
    }
}
