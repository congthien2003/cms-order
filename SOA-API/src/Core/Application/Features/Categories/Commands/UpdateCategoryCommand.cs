using Application.Exceptions;
using Application.Models.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Categories.Commands
{
    /// <summary>
    /// Command to update an existing category.
    /// Part of CQRS pattern - Write operation.
    /// </summary>
    public class UpdateCategoryCommand : IRequest<Result<bool>>
    {
        /// <summary>
        /// Gets the ID of the category to update.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets the category update request data.
        /// </summary>
        /// <summary>
        /// Gets or sets the category name.
        /// Required, max 100 characters.
        /// </summary>
        public string Name { get; set; } = null!;

        /// <summary>
        /// Gets or sets the category description.
        /// Optional, max 500 characters.
        /// </summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the display order for UI sorting.
        /// Must be non-negative.
        /// </summary>
        public int DisplayOrder { get; set; }
    }

    /// <summary>
    /// Handler for UpdateCategoryCommand.
    /// Orchestrates the update of an existing category entity.
    /// </summary>
    public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, Result<bool>>
    {
        private readonly IRepositoryManager _repositoryManager;

        /// <summary>
        /// Initializes a new instance of the UpdateCategoryCommandHandler class.
        /// </summary>
        /// <param name="repositoryManager">The repository manager for data access</param>
        public UpdateCategoryCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        /// <summary>
        /// Handles the update category command.
        /// </summary>
        /// <param name="request">The update category command</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Result indicating success or failure</returns>
        public async Task<Result<bool>> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            // Get category with change tracking enabled
            var category = await _repositoryManager.CategoryRepository
                .GetByIdAsync(request.Id, true, cancellationToken);

            if (category == null)
                throw new NotFoundException($"Category with ID {request.Id} not found", "CATEGORY.NOTFOUND");

            // Check if another category with the same name exists (excluding current category)
            var existingCategory = await _repositoryManager.CategoryRepository
                .ExistsByNameAsync(request.Name, request.Id, cancellationToken);

            if (existingCategory)
                throw new ConflictException($"Category with name '{request.Name}' already exists", "CATEGORY.NOTFOUND");

            // Update category using business methods (validation happens in methods)
            category.UpdateName(request.Name);
            category.UpdateDescription(request.Description);
            category.UpdateDisplayOrder(request.DisplayOrder);

            // Save changes to database
            await _repositoryManager.SaveAsync(cancellationToken);

            return Result<bool>.Success("Category updated successfully", true);
        }
    }
}

