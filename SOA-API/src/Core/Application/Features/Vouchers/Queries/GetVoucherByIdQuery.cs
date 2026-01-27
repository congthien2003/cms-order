using MapsterMapper;
using MediatR;
using Application.Exceptions;
using Application.Features.Vouchers.Models;
using Application.Models.Common;
using Domain.Repositories;

namespace Application.Features.Vouchers.Queries;

public record GetVoucherByIdQuery(Guid Id) : IRequest<Result<VoucherResponse>>;

public class GetVoucherByIdQueryHandler : IRequestHandler<GetVoucherByIdQuery, Result<VoucherResponse>>
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public GetVoucherByIdQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Result<VoucherResponse>> Handle(GetVoucherByIdQuery request, CancellationToken cancellationToken)
    {
        var vouchers = await _repositoryManager.Voucher.FindByConditionAsync(
            v => v.Id == request.Id,
            trackChanges: false,
            cancellationToken
        );

        var voucher = vouchers.FirstOrDefault();

        if (voucher == null)
        {
            throw new NotFoundException($"Voucher with ID {request.Id} not found", "VOUCHER_NOT_FOUND");
        }

        var response = _mapper.Map<VoucherResponse>(voucher);
        return Result<VoucherResponse>.Success(null, response);
    }
}
