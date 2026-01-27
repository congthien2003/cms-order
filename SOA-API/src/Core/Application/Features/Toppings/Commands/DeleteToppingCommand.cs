using MediatR;
using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;

namespace Application.Features.Toppings.Commands;

public record DeleteToppingCommand(Guid Id) : IRequest<Result<Unit>>;

public class DeleteToppingCommandHandler : IRequestHandler<DeleteToppingCommand, Result<Unit>>
{
    private readonly IRepositoryManager _repositoryManager;

    public DeleteToppingCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<Unit>> Handle(DeleteToppingCommand request, CancellationToken cancellationToken)
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

        await _repositoryManager.Topping.DeleteAsync(topping);
        await _repositoryManager.SaveAsync(cancellationToken);

        return Result<Unit>.Success("Topping deleted successfully", Unit.Value);
    }
}
