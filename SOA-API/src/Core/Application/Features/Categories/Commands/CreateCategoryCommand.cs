using Application.DTOs.Category;
using Application.Exceptions;
using Application.Models.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Features.Categories.Commands
{
    /// <summary>
    /// Command to create a new category.
    /// Part of CQRS pattern - Write operation.
    /// </summary>
    public class CreateCategoryCommand : IRequest<Result<Guid>>
    {
        /// <summary>
        /// Gets or sets the category name.
        /// Required, max 100 characters.
        /// </summary>
        public required string Name { get; set; }

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
    /// Handler for CreateCategoryCommand.
    /// Orchestrates the creation of a new category entity.
    /// </summary>
    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Result<Guid>>
    {
        private readonly IRepositoryManager _repositoryManager;

        /// <summary>
        /// Initializes a new instance of the CreateCategoryCommandHandler class.
        /// </summary>
        /// <param name="repositoryManager">The repository manager for data access</param>
        public CreateCategoryCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        /// <summary>
        /// Handles the create category command.
        /// </summary>
        /// <param name="request">The create category command</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Result containing the created category ID</returns>
        public async Task<Result<Guid>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            // Check if category with same name already exists
            var existingCategory = await _repositoryManager.CategoryRepository
                .GetByNameAsync(request.Name, false, cancellationToken);

            if (existingCategory != null)
                throw new ConflictException($"Category with name '{request.Name}' already exists", "CATEGORY.NOTFOUND");

            // Create new category entity (business logic validation happens in constructor)
            var category = new Category(
                request.Name,
                request.Description,
                request.DisplayOrder
            );

            // Add to repository
            await _repositoryManager.CategoryRepository.AddAsync(category);

            // Save changes to database
            await _repositoryManager.SaveAsync(cancellationToken);

            return Result<Guid>.Success("Category created successfully", category.Id);
        }
    }
}

