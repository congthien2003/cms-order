using MediatR;
using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;

namespace Application.Features.Vouchers.Commands;

public record DeleteVoucherCommand(Guid Id) : IRequest<Result<Unit>>;

public class DeleteVoucherCommandHandler : IRequestHandler<DeleteVoucherCommand, Result<Unit>>
{
    private readonly IRepositoryManager _repositoryManager;

    public DeleteVoucherCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<Unit>> Handle(DeleteVoucherCommand request, CancellationToken cancellationToken)
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

        await _repositoryManager.Voucher.DeleteAsync(voucher);
        await _repositoryManager.SaveAsync(cancellationToken);

        return Result<Unit>.Success("Voucher deleted successfully", Unit.Value);
    }
}
