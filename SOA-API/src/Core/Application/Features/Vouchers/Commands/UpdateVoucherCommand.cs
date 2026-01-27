using MapsterMapper;
using MediatR;
using Application.Exceptions;
using Application.Features.Vouchers.Models;
using Application.Models.Common;
using Domain.Repositories;

namespace Application.Features.Vouchers.Commands;

public record UpdateVoucherCommand(Guid Id, UpdateVoucherRequest Request) : IRequest<Result<VoucherResponse>>;

public class UpdateVoucherCommandHandler : IRequestHandler<UpdateVoucherCommand, Result<VoucherResponse>>
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public UpdateVoucherCommandHandler(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Result<VoucherResponse>> Handle(UpdateVoucherCommand request, CancellationToken cancellationToken)
    {
        var vouchers = await _repositoryManager.Voucher.FindByConditionAsync(
            v => v.Id == request.Id,
            trackChanges: true,
            cancellationToken
        );

        var voucher = vouchers.FirstOrDefault();

        if (voucher == null)
        {
            throw new NotFoundException($"Voucher with ID {request.Id} not found", "VOUCHER_NOT_FOUND");
        }

        voucher.UpdateDetails(
            request.Request.Name,
            request.Request.Description,
            request.Request.DiscountType,
            request.Request.DiscountValue,
            request.Request.StartDate,
            request.Request.EndDate,
            request.Request.MinOrderAmount,
            request.Request.MaxDiscountAmount,
            request.Request.UsageLimit
        );

        await _repositoryManager.SaveAsync(cancellationToken);

        var response = _mapper.Map<VoucherResponse>(voucher);
        return Result<VoucherResponse>.Success("Voucher updated successfully", response);
    }
}
