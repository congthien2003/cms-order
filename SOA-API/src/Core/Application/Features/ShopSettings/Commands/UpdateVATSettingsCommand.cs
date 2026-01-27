using Application.Exceptions;
using Application.Features.ShopSettings.Models;
using Application.Models.Common;
using MapsterMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Features.ShopSettings.Commands
{
    /// <summary>
    /// Command to update VAT settings
    /// </summary>
    public sealed record UpdateVATSettingsCommand(UpdateVATSettingsRequest Request) : IRequest<Result<ShopSettingsResponse>>;

    internal sealed class UpdateVATSettingsCommandHandler : IRequestHandler<UpdateVATSettingsCommand, Result<ShopSettingsResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public UpdateVATSettingsCommandHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<ShopSettingsResponse>> Handle(UpdateVATSettingsCommand request, CancellationToken cancellationToken)
        {
            var settings = await _repositoryManager.ShopSettingRepository.GetSettingsAsync(trackChanges: true, cancellationToken);

            if (settings == null)
            {
                throw new NotFoundException("Shop settings not found", "SHOP_SETTINGS_NOT_FOUND");
            }

            settings.UpdateVATSettings(request.Request.VATPercentage, request.Request.IsVATEnabled);

            await _repositoryManager.SaveAsync(cancellationToken);

            var response = _mapper.Map<ShopSettingsResponse>(settings);
            return Result<ShopSettingsResponse>.Success("VAT settings updated successfully", response);
        }
    }
}
