using Application.Exceptions;
using Application.Features.ShopSettings.Models;
using Application.Models.Common;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Features.ShopSettings.Commands
{
    /// <summary>
    /// Command to update receipt footer
    /// </summary>
    public sealed record UpdateReceiptFooterCommand(UpdateReceiptFooterRequest Request) : IRequest<Result<ShopSettingsResponse>>;

    internal sealed class UpdateReceiptFooterCommandHandler : IRequestHandler<UpdateReceiptFooterCommand, Result<ShopSettingsResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public UpdateReceiptFooterCommandHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<ShopSettingsResponse>> Handle(UpdateReceiptFooterCommand request, CancellationToken cancellationToken)
        {
            var settings = await _repositoryManager.ShopSettingRepository.GetSettingsAsync(trackChanges: true, cancellationToken);

            if (settings == null)
            {
                throw new NotFoundException("Shop settings not found", "SHOP_SETTINGS_NOT_FOUND");
            }

            settings.UpdateReceiptFooter(request.Request.ReceiptFooter);

            await _repositoryManager.SaveAsync(cancellationToken);

            var response = _mapper.Map<ShopSettingsResponse>(settings);
            return Result<ShopSettingsResponse>.Success("Receipt footer updated successfully", response);
        }
    }
}
