using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Categories.Commands
{
    /// <summary>
    /// Command to delete an existing category.
    /// Part of CQRS pattern - Write operation.
    /// Implements soft delete via IsDeleted flag.
    /// </summary>
    public class DeleteCategoryCommand : IRequest<Result<bool>>
    {
        /// <summary>
        /// Gets the ID of the category to delete.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Initializes a new instance of the DeleteCategoryCommand class.
        /// </summary>
        /// <param name="id">The ID of the category to delete</param>
        public DeleteCategoryCommand(Guid id)
        {
            Id = id;
        }
    }

    /// <summary>
    /// Handler for DeleteCategoryCommand.
    /// Orchestrates the deletion (soft delete) of a category entity.
    /// </summary>
    public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Result<bool>>
    {
        private readonly IRepositoryManager _repositoryManager;

        /// <summary>
        /// Initializes a new instance of the DeleteCategoryCommandHandler class.
        /// </summary>
        /// <param name="repositoryManager">The repository manager for data access</param>
        public DeleteCategoryCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        /// <summary>
        /// Handles the delete category command.
        /// </summary>
        /// <param name="request">The delete category command</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Result indicating success or failure</returns>
        public async Task<Result<bool>> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            // Get category with change tracking enabled
            var category = await _repositoryManager.CategoryRepository
                .GetByIdAsync(request.Id, true, cancellationToken);

            if (category == null)
                throw new NotFoundException($"Category with ID {request.Id} not found", "CATEGORY.NOTFOUND");

            // Delete (soft delete via IsDeleted flag)
            await _repositoryManager.CategoryRepository.DeleteAsync(category);

            // Save changes to database
            await _repositoryManager.SaveAsync(cancellationToken);

            return Result<bool>.Success("Category deleted successfully", true);
        }
    }
}

