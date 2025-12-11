using Application.Features.Categories.Dtos;
using Application.Models.Common;
using Domain.Repositories;
using MapsterMapper;
using MediatR;

namespace Application.Features.Categories.Queries
{
    /// <summary>
    /// Query to retrieve a paginated list of categories.
    /// Part of CQRS pattern - Read operation.
    /// Supports pagination, filtering, and sorting.
    /// </summary>
    public class GetCategoriesListQuery : IRequest<Result<PagedResult<CategoryResponse>>>
    {
        /// <summary>
        /// Gets the pagination and filtering parameters.
        /// </summary>
        public GetListParameters Parameters { get; set; }

        /// <summary>
        /// Initializes a new instance of the GetCategoriesListQuery class.
        /// </summary>
        /// <param name="parameters">The pagination and filtering parameters</param>
        public GetCategoriesListQuery(GetListParameters parameters)
        {
            Parameters = parameters;
        }
    }

    /// <summary>
    /// Handler for GetCategoriesListQuery.
    /// Retrieves a paginated list of categories and maps them to response DTOs.
    /// </summary>
    public class GetCategoriesListQueryHandler : IRequestHandler<GetCategoriesListQuery, Result<PagedResult<CategoryResponse>>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        /// <summary>
        /// Initializes a new instance of the GetCategoriesListQueryHandler class.
        /// </summary>
        /// <param name="repositoryManager">The repository manager for data access</param>
        /// <param name="mapper">The mapper for DTO conversion</param>
        public GetCategoriesListQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        /// <summary>
        /// Handles the get categories list query.
        /// </summary>
        /// <param name="request">The get categories list query</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Result containing paginated category response DTOs</returns>
        public async Task<Result<PagedResult<CategoryResponse>>> Handle(GetCategoriesListQuery request, CancellationToken cancellationToken)
        {
            // Get paginated list from repository (no tracking needed for read-only operation)
            var pagedCategories = await _repositoryManager.CategoryRepository
                .GetListAsync(request.Parameters.Page, request.Parameters.PageSize, request.Parameters?.SearchTerm ?? string.Empty, false, cancellationToken);

            // Map entities to response DTOs
            var mappedCategories = _mapper.Map<IReadOnlyList<CategoryResponse>>(pagedCategories.categories);

            // Create paged result wrapper
            var result = new PagedResult<CategoryResponse>(
                mappedCategories,
                pagedCategories.totalCounts,
                request.Parameters.Page,
                request.Parameters.PageSize,
                (int)Math.Ceiling(pagedCategories.totalCounts / (double)request.Parameters.PageSize)
            );

            return Result<PagedResult<CategoryResponse>>.Success("Categories retrieved successfully", result);
        }
    }
}

