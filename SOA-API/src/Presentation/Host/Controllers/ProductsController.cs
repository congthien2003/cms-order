using Application.Features.Products.Commands;
using Application.Features.Products.Models;
using Application.Features.Products.Queries;
using Application.Models.Common;
using Asp.Versioning;
using Host.Controllers.Base;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Host.Controllers;

/// <summary>
/// API controller for managing products.
/// Provides endpoints for CRUD operations on products, sizes, and toppings.
/// </summary>
[ApiController]
[ApiVersion(1)]
[Route("api/v{v:apiVersion}/products")]
[Produces("application/json")]
public class ProductsController : BaseController
{
    #region Product CRUD

    /// <summary>
    /// Retrieves a paginated list of products with optional filtering.
    /// </summary>
    /// <param name="parameters">Query parameters for filtering, pagination</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated list of products</returns>
    [HttpPost("list", Name = "GetProductsList")]
    [ProducesResponseType(typeof(Result<PagedResult<ProductResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetList([FromBody] GetProductsListParameters parameters, CancellationToken cancellationToken)
    {
        var query = new GetProductsListQuery(parameters);
        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves a product by its ID with full details (sizes, toppings).
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Product details</returns>
    [HttpGet("{id:guid}", Name = "GetProductById")]
    [ProducesResponseType(typeof(Result<ProductDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetProductByIdQuery(id);
        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves products by category ID.
    /// </summary>
    /// <param name="categoryId">Category ID</param>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20)</param>
    /// <param name="searchTerm">Search term</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Paginated list of products in the category</returns>
    [HttpGet("by-category/{categoryId:guid}", Name = "GetProductsByCategory")]
    [ProducesResponseType(typeof(Result<PagedResult<ProductResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByCategory(
        Guid categoryId, 
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetProductsByCategoryQuery(categoryId, page, pageSize, searchTerm);
        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Creates a new product.
    /// </summary>
    /// <param name="request">Product creation request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created product details</returns>
    [HttpPost(Name = "CreateProduct")]
    [ProducesResponseType(typeof(Result<ProductDetailResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateProductCommand(request);
        var result = await Mediator.Send(command, cancellationToken);
        return CreatedAtRoute("GetProductById", new { id = result.Data?.Id }, result);
    }

    /// <summary>
    /// Updates an existing product.
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="request">Product update request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated product details</returns>
    [HttpPut("{id:guid}", Name = "UpdateProduct")]
    [ProducesResponseType(typeof(Result<ProductDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateProductCommand(id, request);
        var result = await Mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Deletes a product.
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id:guid}", Name = "DeleteProduct")]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var command = new DeleteProductCommand(id);
        var result = await Mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Toggles the active status of a product.
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>New active status</returns>
    [HttpPatch("{id:guid}/toggle-status", Name = "ToggleProductStatus")]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleStatus(Guid id, CancellationToken cancellationToken)
    {
        var command = new ToggleProductStatusCommand(id);
        var result = await Mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Product Sizes

    /// <summary>
    /// Adds a size to a product.
    /// </summary>
    /// <param name="productId">Product ID</param>
    /// <param name="request">Size creation request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created size details</returns>
    [HttpPost("{productId:guid}/sizes", Name = "AddProductSize")]
    [ProducesResponseType(typeof(Result<ProductSizeResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> AddSize(Guid productId, [FromBody] CreateProductSizeRequest request, CancellationToken cancellationToken)
    {
        var command = new AddProductSizeCommand(productId, request);
        var result = await Mediator.Send(command, cancellationToken);
        return Created($"/api/v1/products/{productId}/sizes/{result.Data?.Id}", result);
    }

    /// <summary>
    /// Updates a product size.
    /// </summary>
    /// <param name="productId">Product ID</param>
    /// <param name="sizeId">Size ID</param>
    /// <param name="request">Size update request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated size details</returns>
    [HttpPut("{productId:guid}/sizes/{sizeId:guid}", Name = "UpdateProductSize")]
    [ProducesResponseType(typeof(Result<ProductSizeResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> UpdateSize(Guid productId, Guid sizeId, [FromBody] UpdateProductSizeRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateProductSizeCommand(productId, sizeId, request);
        var result = await Mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Deletes a product size.
    /// </summary>
    /// <param name="productId">Product ID</param>
    /// <param name="sizeId">Size ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success status</returns>
    [HttpDelete("{productId:guid}/sizes/{sizeId:guid}", Name = "DeleteProductSize")]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteSize(Guid productId, Guid sizeId, CancellationToken cancellationToken)
    {
        var command = new DeleteProductSizeCommand(productId, sizeId);
        var result = await Mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    #endregion

    #region Product Toppings

    /// <summary>
    /// Gets all toppings assigned to a product.
    /// </summary>
    /// <param name="productId">Product ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of product toppings</returns>
    [HttpGet("{productId:guid}/toppings", Name = "GetProductToppings")]
    [ProducesResponseType(typeof(Result<IReadOnlyList<ProductToppingResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetToppings(Guid productId, CancellationToken cancellationToken)
    {
        var query = new GetProductToppingsQuery(productId);
        var result = await Mediator.Send(query, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Adds a topping to a product.
    /// </summary>
    /// <param name="productId">Product ID</param>
    /// <param name="request">Topping assignment request</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Created product topping details</returns>
    [HttpPost("{productId:guid}/toppings", Name = "AddProductTopping")]
    [ProducesResponseType(typeof(Result<ProductToppingResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> AddTopping(Guid productId, [FromBody] ProductToppingRequest request, CancellationToken cancellationToken)
    {
        var command = new AddProductToppingCommand(productId, request);
        var result = await Mediator.Send(command, cancellationToken);
        return Created($"/api/v1/products/{productId}/toppings/{result.Data?.ToppingId}", result);
    }

    /// <summary>
    /// Removes a topping from a product.
    /// </summary>
    /// <param name="productId">Product ID</param>
    /// <param name="toppingId">Topping ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Success status</returns>
    [HttpDelete("{productId:guid}/toppings/{toppingId:guid}", Name = "RemoveProductTopping")]
    [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveTopping(Guid productId, Guid toppingId, CancellationToken cancellationToken)
    {
        var command = new RemoveProductToppingCommand(productId, toppingId);
        var result = await Mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Bulk updates all toppings for a product (replaces existing).
    /// </summary>
    /// <param name="productId">Product ID</param>
    /// <param name="request">List of toppings to assign</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated list of product toppings</returns>
    [HttpPut("{productId:guid}/toppings", Name = "UpdateProductToppings")]
    [ProducesResponseType(typeof(Result<IReadOnlyList<ProductToppingResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateToppings(Guid productId, [FromBody] UpdateProductToppingsRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateProductToppingsCommand(productId, request);
        var result = await Mediator.Send(command, cancellationToken);
        return Ok(result);
    }

    #endregion
}
