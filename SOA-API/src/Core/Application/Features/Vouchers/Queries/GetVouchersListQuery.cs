using MapsterMapper;
using MediatR;
using Application.Features.Vouchers.Models;
using Application.Models.Common;
using Domain.Repositories;

namespace Application.Features.Vouchers.Queries;

public record GetVouchersListQuery(
    bool? IsActive = null,
    string? SearchTerm = null,
    bool? OnlyValid = null,
    int PageNumber = 1,
    int PageSize = 50
) : IRequest<Result<PagedList<VoucherResponse>>>;

public class GetVouchersListQueryHandler : IRequestHandler<GetVouchersListQuery, Result<PagedList<VoucherResponse>>>
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public GetVouchersListQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Result<PagedList<VoucherResponse>>> Handle(GetVouchersListQuery request, CancellationToken cancellationToken)
    {
        var vouchers = await _repositoryManager.Voucher.GetAllAsync(trackChanges: false, cancellationToken);

        var filteredVouchers = vouchers.AsQueryable();

        // Filter by active status
        if (request.IsActive.HasValue)
        {
            filteredVouchers = filteredVouchers.Where(v => v.IsActive == request.IsActive.Value);
        }

        // Filter only valid vouchers (active + within date range + has usage left)
        if (request.OnlyValid == true)
        {
            var now = DateTime.UtcNow;
            filteredVouchers = filteredVouchers.Where(v => 
                v.IsActive && 
                v.StartDate <= now && 
                v.EndDate >= now &&
                (!v.UsageLimit.HasValue || v.UsedCount < v.UsageLimit.Value)
            );
        }

        // Search by code or name
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var searchLower = request.SearchTerm.ToLower();
            filteredVouchers = filteredVouchers.Where(v => 
                v.Code.ToLower().Contains(searchLower) || 
                v.Name.ToLower().Contains(searchLower)
            );
        }

        // Order by end date descending (newest first)
        filteredVouchers = filteredVouchers.OrderByDescending(v => v.EndDate).ThenBy(v => v.Code);

        var totalCount = filteredVouchers.Count();
        var pagedVouchers = filteredVouchers
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        var voucherResponses = _mapper.Map<List<VoucherResponse>>(pagedVouchers);

        var pagedList = new PagedList<VoucherResponse>(
            voucherResponses,
            totalCount,
            request.PageNumber,
            request.PageSize
        );

        return Result<PagedList<VoucherResponse>>.Success(null, pagedList);
    }
}
