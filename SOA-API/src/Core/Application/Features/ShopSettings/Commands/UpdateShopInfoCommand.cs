using Application.Exceptions;
using Application.Features.ShopSettings.Models;
using Application.Models.Common;
using MapsterMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Features.ShopSettings.Commands
{
    /// <summary>
    /// Command to update shop information
    /// </summary>
    public sealed record UpdateShopInfoCommand(UpdateShopInfoRequest Request) : IRequest<Result<ShopSettingsResponse>>;

    internal sealed class UpdateShopInfoCommandHandler : IRequestHandler<UpdateShopInfoCommand, Result<ShopSettingsResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public UpdateShopInfoCommandHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<ShopSettingsResponse>> Handle(UpdateShopInfoCommand request, CancellationToken cancellationToken)
        {
            var settings = await _repositoryManager.ShopSettingRepository.GetSettingsAsync(trackChanges: true, cancellationToken);

            if (settings == null)
            {
                throw new NotFoundException("Shop settings not found", "SHOP_SETTINGS_NOT_FOUND");
            }

            settings.UpdateInfo(
                request.Request.ShopName,
                request.Request.Address,
                request.Request.Phone,
                request.Request.Email
            );

            if (!string.IsNullOrEmpty(request.Request.Logo))
            {
                settings.UpdateLogo(request.Request.Logo);
            }

            await _repositoryManager.SaveAsync(cancellationToken);

            var response = _mapper.Map<ShopSettingsResponse>(settings);
            return Result<ShopSettingsResponse>.Success("Shop information updated successfully", response);
        }
    }
}
