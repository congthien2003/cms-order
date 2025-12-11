using Application.Exceptions;
using Application.Features.Categories.Dtos;
using Application.Models.Common;
using Domain.Repositories;
using MapsterMapper;
using MediatR;

namespace Application.Features.Categories.Queries
{
    /// <summary>
    /// Query to retrieve a category by its ID.
    /// Part of CQRS pattern - Read operation.
    /// </summary>
    public class GetCategoryByIdQuery : IRequest<Result<CategoryResponse>>
    {
        /// <summary>
        /// Gets the ID of the category to retrieve.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Initializes a new instance of the GetCategoryByIdQuery class.
        /// </summary>
        /// <param name="id">The ID of the category to retrieve</param>
        public GetCategoryByIdQuery(Guid id)
        {
            Id = id;
        }
    }

    /// <summary>
    /// Handler for GetCategoryByIdQuery.
    /// Retrieves a single category by ID and maps it to response DTO.
    /// </summary>
    public class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, Result<CategoryResponse>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the GetCategoryByIdQueryHandler class.
        /// </summary>
        /// <param name="repositoryManager">The repository manager for data access</param>
        /// <param name="mapper">The mapper for DTO conversion</param>
        public GetCategoryByIdQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        /// <summary>
        /// Handles the get category by ID query.
        /// </summary>
        /// <param name="request">The get category by ID query</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Result containing the category response DTO</returns>
        public async Task<Result<CategoryResponse>> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            // Get category from repository (no tracking needed for read-only operation)
            var category = await _repositoryManager.CategoryRepository
                .GetByIdAsync(request.Id, false, cancellationToken);

            if (category == null)
                throw new NotFoundException($"Category with ID {request.Id} not found", "CATEGORY.NOTFOUND");

            // Map entity to response DTO
            var response = _mapper.Map<CategoryResponse>(category);

            return Result<CategoryResponse>.Success("Category retrieved successfully", response);
        }
    }
}

