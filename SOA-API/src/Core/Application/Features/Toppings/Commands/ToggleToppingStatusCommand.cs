using MediatR;
using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;

namespace Application.Features.Toppings.Commands;

public record ToggleToppingStatusCommand(Guid Id) : IRequest<Result<bool>>;

public class ToggleToppingStatusCommandHandler : IRequestHandler<ToggleToppingStatusCommand, Result<bool>>
{
    private readonly IRepositoryManager _repositoryManager;

    public ToggleToppingStatusCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<bool>> Handle(ToggleToppingStatusCommand request, CancellationToken cancellationToken)
    {
        var toppings = await _repositoryManager.Topping.FindByConditionAsync(
            t => t.Id == request.Id,
            trackChanges: true,
            cancellationToken
        );

        var topping = toppings.FirstOrDefault();

        if (topping == null)
        {
            throw new NotFoundException($"Topping with ID {request.Id} not found", "TOPPING_NOT_FOUND");
        }

        topping.ToggleStatus();

        await _repositoryManager.SaveAsync(cancellationToken);

        return Result<bool>.Success($"Topping status updated to {(topping.IsActive ? "Active" : "Inactive")}", topping.IsActive);
    }
}
