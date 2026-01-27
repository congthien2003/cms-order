using MapsterMapper;
using MediatR;
using Application.Exceptions;
using Application.Features.Vouchers.Models;
using Application.Models.Common;
using Domain.Entities;
using Domain.Repositories;

namespace Application.Features.Vouchers.Commands;

public record CreateVoucherCommand(CreateVoucherRequest Request) : IRequest<Result<VoucherResponse>>;

public class CreateVoucherCommandHandler : IRequestHandler<CreateVoucherCommand, Result<VoucherResponse>>
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public CreateVoucherCommandHandler(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Result<VoucherResponse>> Handle(CreateVoucherCommand request, CancellationToken cancellationToken)
    {
        // Check if code already exists
        var existingVouchers = await _repositoryManager.Voucher.FindByConditionAsync(
            v => v.Code.ToLower() == request.Request.Code.ToLower(),
            trackChanges: false,
            cancellationToken
        );

        if (existingVouchers.Any())
        {
            throw new BadRequestException($"Voucher with code '{request.Request.Code}' already exists", "VOUCHER_CODE_EXISTS");
        }

        var voucher = new Voucher(
            request.Request.Code,
            request.Request.Name,
            request.Request.DiscountType,
            request.Request.DiscountValue,
            request.Request.StartDate,
            request.Request.EndDate,
            request.Request.Description,
            request.Request.MinOrderAmount,
            request.Request.MaxDiscountAmount,
            request.Request.UsageLimit
        );

        await _repositoryManager.Voucher.AddAsync(voucher);
        await _repositoryManager.SaveAsync(cancellationToken);

        var response = _mapper.Map<VoucherResponse>(voucher);
        return Result<VoucherResponse>.Success("Voucher created successfully", response);
    }
}
