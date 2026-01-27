using Application.Exceptions;
using Application.Features.ShopSettings.Models;
using Application.Models.Common;
using MapsterMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Features.ShopSettings.Queries
{
    /// <summary>
    /// Query to get shop settings
    /// </summary>
    public sealed record GetShopSettingsQuery : IRequest<Result<ShopSettingsResponse>>;

    internal sealed class GetShopSettingsQueryHandler : IRequestHandler<GetShopSettingsQuery, Result<ShopSettingsResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public GetShopSettingsQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<ShopSettingsResponse>> Handle(GetShopSettingsQuery request, CancellationToken cancellationToken)
        {
            var settings = await _repositoryManager.ShopSettingRepository.GetSettingsAsync(trackChanges: false, cancellationToken);

            if (settings == null)
            {
                throw new NotFoundException("Shop settings not found. Please initialize the system first.", "SHOP_SETTINGS_NOT_FOUND");
            }

            var response = _mapper.Map<ShopSettingsResponse>(settings);
            return Result<ShopSettingsResponse>.Success(null, response);
        }
    }
}
