using MediatR;
using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;

namespace Application.Features.Vouchers.Commands;

public record ToggleVoucherStatusCommand(Guid Id) : IRequest<Result<bool>>;

public class ToggleVoucherStatusCommandHandler : IRequestHandler<ToggleVoucherStatusCommand, Result<bool>>
{
    private readonly IRepositoryManager _repositoryManager;

    public ToggleVoucherStatusCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<bool>> Handle(ToggleVoucherStatusCommand request, CancellationToken cancellationToken)
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

        voucher.ToggleStatus();

        await _repositoryManager.SaveAsync(cancellationToken);

        return Result<bool>.Success($"Voucher status updated to {(voucher.IsActive ? "Active" : "Inactive")}", voucher.IsActive);
    }
}
