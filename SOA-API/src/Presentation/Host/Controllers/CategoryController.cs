using Application.Features.Categories.Commands;
using Application.Features.Categories.Dtos;
using Application.Features.Categories.Queries;
using Application.Models.Common;
using Asp.Versioning;
using Host.Controllers.Base;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Host.Controllers
{
    /// <summary>
    /// API controller for managing product categories.
    /// Provides endpoints for CRUD operations on categories.
    /// </summary>
    [ApiController]
    [ApiVersion(1)]
    [Route("api/v{v:apiVersion}/categories")]
    [Produces("application/json")]
    public class CategoryController : BaseController
    {
        /// <summary>
        /// Retrieves a category by its unique identifier.
        /// </summary>
        /// <param name="id">The unique identifier of the category</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        /// <returns>The category information if found</returns>
        /// <response code="200">Category found and returned successfully</response>
        /// <response code="404">Category not found</response>
        /// <response code="500">Internal server error</response>
        [ProducesResponseType(typeof(Result<CategoryResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpGet("{id}", Name = "GetCategoryById")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetCategoryByIdQuery(id);
            var result = await Mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves a paginated list of categories with optional filtering and sorting.
        /// </summary>
        /// <param name="request">Pagination, filtering, and sorting parameters</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        /// <returns>A paginated list of categories</returns>
        /// <response code="200">Categories retrieved successfully</response>
        /// <response code="400">Invalid pagination parameters</response>
        /// <response code="500">Internal server error</response>
        [ProducesResponseType(typeof(Result<PagedResult<CategoryResponse>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost("list", Name = "GetCategoriesList")]
        public async Task<IActionResult> GetList([FromBody] GetListParameters request, CancellationToken cancellationToken)
        {
            var query = new GetCategoriesListQuery(request);
            var result = await Mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Creates a new category.
        /// </summary>
        /// <param name="request">The category creation request containing name, description, and display order</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        /// <returns>The ID of the newly created category</returns>
        /// <response code="201">Category created successfully</response>
        /// <response code="400">Invalid request data or validation failed</response>
        /// <response code="409">Category with the same name already exists</response>
        /// <response code="500">Internal server error</response>
        [ProducesResponseType(typeof(Result<Guid>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPost(Name = "CreateCategory")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(request, cancellationToken);
            return CreatedAtRoute("GetCategoryById", new { id = result.Data }, result);
        }

        /// <summary>
        /// Updates an existing category.
        /// </summary>
        /// <param name="id">The unique identifier of the category to update</param>
        /// <param name="request">The category update request containing updated name, description, and display order</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        /// <returns>Success status of the update operation</returns>
        /// <response code="200">Category updated successfully</response>
        /// <response code="400">Invalid request data or validation failed</response>
        /// <response code="404">Category not found</response>
        /// <response code="409">Another category with the same name already exists</response>
        /// <response code="500">Internal server error</response>
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPut("{id}", Name = "UpdateCategory")]
        public async Task<IActionResult> Update(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(request, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Deletes a category (soft delete - marks as deleted without removing from database).
        /// </summary>
        /// <param name="id">The unique identifier of the category to delete</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        /// <returns>Success status of the delete operation</returns>
        /// <response code="200">Category deleted successfully</response>
        /// <response code="404">Category not found</response>
        /// <response code="500">Internal server error</response>
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpDelete("{id}", Name = "DeleteCategory")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var command = new DeleteCategoryCommand(id);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Toggles the active status of a category.
        /// </summary>
        /// <param name="id">The unique identifier of the category</param>
        /// <param name="cancellationToken">Cancellation token for the operation</param>
        /// <returns>The new active status of the category</returns>
        /// <response code="200">Category status toggled successfully</response>
        /// <response code="404">Category not found</response>
        /// <response code="500">Internal server error</response>
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [HttpPatch("{id}/toggle-status", Name = "ToggleCategoryStatus")]
        public async Task<IActionResult> ToggleStatus(Guid id, CancellationToken cancellationToken)
        {
            var command = new ToggleCategoryStatusCommand(id);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
    }
}

