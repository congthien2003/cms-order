using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Categories.Commands;

/// <summary>
/// Command to toggle the active status of a category.
/// </summary>
public record ToggleCategoryStatusCommand(Guid Id) : IRequest<Result<bool>>;

/// <summary>
/// Handler for ToggleCategoryStatusCommand.
/// </summary>
public class ToggleCategoryStatusCommandHandler : IRequestHandler<ToggleCategoryStatusCommand, Result<bool>>
{
    private readonly IRepositoryManager _repositoryManager;

    public ToggleCategoryStatusCommandHandler(IRepositoryManager repositoryManager)
    {
        _repositoryManager = repositoryManager;
    }

    public async Task<Result<bool>> Handle(ToggleCategoryStatusCommand request, CancellationToken cancellationToken)
    {
        var category = await _repositoryManager.CategoryRepository
            .GetByIdAsync(request.Id, true, cancellationToken);

        if (category == null)
            throw new NotFoundException($"Category with ID {request.Id} not found", "CATEGORY.NOTFOUND");

        category.ToggleStatus();

        await _repositoryManager.SaveAsync(cancellationToken);

        var statusText = category.IsActive ? "activated" : "deactivated";
        return Result<bool>.Success($"Category {statusText} successfully", category.IsActive);
    }
}
