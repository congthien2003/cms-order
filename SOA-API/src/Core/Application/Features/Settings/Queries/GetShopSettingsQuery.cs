using Application.Features.Settings.Models;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Settings.Queries;

/// <summary>
/// Query to get shop settings
/// </summary>
public record GetShopSettingsQuery : IRequest<Result<ShopSettingsResponse>>;

public class GetShopSettingsQueryHandler : IRequestHandler<GetShopSettingsQuery, Result<ShopSettingsResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public GetShopSettingsQueryHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<ShopSettingsResponse>> Handle(GetShopSettingsQuery request, CancellationToken cancellationToken)
    {
        var settings = await _repositoryManager.ShopSettingRepository
            .GetSettingsAsync(false, cancellationToken);

        if (settings == null)
        {
            // Return default settings if none exist
            return Result<ShopSettingsResponse>.Success("Shop settings retrieved successfully", new ShopSettingsResponse
            {
                ShopName = "Coffee Shop",
                Address = "",
                Phone = "",
                Email = "",
                DefaultVATPercentage = 10,
                IsVATEnabled = true
            });
        }

        var response = new ShopSettingsResponse
        {
            Id = settings.Id,
            ShopName = settings.ShopName,
            Address = settings.Address,
            Phone = settings.Phone,
            Email = settings.Email,
            Logo = settings.Logo,
            DefaultVATPercentage = settings.DefaultVATPercentage,
            IsVATEnabled = settings.IsVATEnabled,
            ReceiptFooter = settings.ReceiptFooter,
            UpdatedAt = settings.UpdatedAt
        };

        return Result<ShopSettingsResponse>.Success("Shop settings retrieved successfully", response);
    }
}
