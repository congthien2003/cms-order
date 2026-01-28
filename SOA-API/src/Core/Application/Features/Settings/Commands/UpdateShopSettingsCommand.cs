using Application.Features.Settings.Models;
using Application.Models.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Settings.Commands;

/// <summary>
/// Command to update shop settings
/// </summary>
public record UpdateShopSettingsCommand(UpdateShopSettingsRequest Request) : IRequest<Result<ShopSettingsResponse>>;

public class UpdateShopSettingsCommandHandler : IRequestHandler<UpdateShopSettingsCommand, Result<ShopSettingsResponse>>
{
    private readonly IRepositoryManager _repositoryManager;

    public UpdateShopSettingsCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<ShopSettingsResponse>> Handle(UpdateShopSettingsCommand request, CancellationToken cancellationToken)
    {
        var settings = await _repositoryManager.ShopSettingRepository
            .GetSettingsAsync(true, cancellationToken);

        if (settings == null)
        {
            // Create new settings if none exist
            settings = new ShopSetting(
                request.Request.ShopName,
                request.Request.Address,
                request.Request.Phone,
                request.Request.Email,
                request.Request.DefaultVATPercentage,
                request.Request.IsVATEnabled,
                request.Request.Logo,
                request.Request.ReceiptFooter
            );

            await _repositoryManager.ShopSettingRepository.AddAsync(settings);
        }
        else
        {
            // Update existing settings
            settings.UpdateInfo(
                request.Request.ShopName,
                request.Request.Address,
                request.Request.Phone,
                request.Request.Email,
                request.Request.Logo,
                request.Request.ReceiptFooter
            );

            settings.UpdateVATSettings(
                request.Request.DefaultVATPercentage,
                request.Request.IsVATEnabled
            );
        }

        await _repositoryManager.SaveAsync(cancellationToken);

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

        return Result<ShopSettingsResponse>.Success("Shop settings updated successfully", response);
    }
}
