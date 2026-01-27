# 📘 Coding Conventions & Implementation Guide

> **Dự án:** Store Order Management System  
> **Ngày tạo:** 27/01/2026  
> **Mục đích:** Hướng dẫn chi tiết về coding conventions và cách implement cho cả Backend (.NET) và Frontend (React)

---

## 📑 Mục lục

1. [Backend (.NET API) Conventions](#backend-net-api-conventions)
2. [Frontend (React) Conventions](#frontend-react-conventions)
3. [Database & Entity Conventions](#database--entity-conventions)
4. [API Design Conventions](#api-design-conventions)
5. [Error Handling Patterns](#error-handling-patterns)
6. [Testing Guidelines](#testing-guidelines)

---

## 🔷 Backend (.NET API) Conventions

### 🏗️ Kiến trúc: Clean Architecture + CQRS + MediatR

Dự án sử dụng **Clean Architecture** với 4 layers chính:

```
Core/
├── Domain/          # Entities, Repository Interfaces, Business Rules
└── Application/     # Business Logic, CQRS Handlers, DTOs, Services

Infrastructure/      # Data Access, External Services, Implementations

Presentation/        # API Controllers, Middleware, Extensions
```

### 📂 Cấu trúc Feature Module

Mỗi feature được tổ chức theo cấu trúc CQRS pattern:

```
Application/Features/[FeatureName]/
├── Commands/                    # Write Operations (Create, Update, Delete)
│   ├── CreateXCommand.cs       # Command definition
│   └── CreateXCommandHandler.cs # Command handler (logic implementation)
├── Queries/                     # Read Operations (Get, List)
│   ├── GetXByIdQuery.cs        # Query definition
│   └── GetXByIdQueryHandler.cs # Query handler (logic implementation)
├── Dtos/                        # Data Transfer Objects
│   ├── XRequest.cs             # Request DTOs
│   └── XResponse.cs            # Response DTOs
└── Validators/                  # FluentValidation Validators
    ├── CreateXCommandValidator.cs
    └── UpdateXCommandValidator.cs
```

### 📝 Naming Conventions

#### 1. **Classes & Interfaces**

```csharp
// ✅ ĐÚNG - PascalCase
public class Category { }
public interface ICategoryRepository { }
public class CategoryService { }

// ❌ SAI
public class category { }
public interface categoryRepository { }
```

#### 2. **Methods & Properties**

```csharp
// ✅ ĐÚNG - PascalCase
public string Name { get; private set; }
public async Task<Result> GetCategoryById(Guid id) { }

// ❌ SAI
public string name { get; private set; }
public async Task<Result> getCategoryById(Guid id) { }
```

#### 3. **Variables & Parameters**

```csharp
// ✅ ĐÚNG - camelCase
var categoryName = "Drinks";
public void UpdateCategory(string categoryName, int displayOrder) { }

// ❌ SAI
var CategoryName = "Drinks";
public void UpdateCategory(string CategoryName, int DisplayOrder) { }
```

#### 4. **Constants**

```csharp
// ✅ ĐÚNG - UPPER_CASE với underscore
public const string DEFAULT_LANGUAGE = "vi-VN";
public const int MAX_PAGE_SIZE = 100;

// ❌ SAI
public const string defaultLanguage = "vi-VN";
```

### 🎯 Command Pattern (Write Operations)

**File:** `Application/Features/[Feature]/Commands/Create[Feature]Command.cs`

```csharp
using Application.Models.Common;
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

        public CreateCategoryCommandHandler(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Result<Guid>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            // 1. Validate business rules
            var existingCategory = await _repositoryManager.CategoryRepository
                .GetByNameAsync(request.Name, false, cancellationToken);

            if (existingCategory != null)
                throw new ConflictException($"Category with name '{request.Name}' already exists");

            // 2. Create entity (business logic in constructor)
            var category = new Category(
                request.Name,
                request.Description,
                request.DisplayOrder
            );

            // 3. Add to repository
            await _repositoryManager.CategoryRepository.AddAsync(category);

            // 4. Save changes
            await _repositoryManager.SaveAsync(cancellationToken);

            // 5. Return result
            return Result<Guid>.Success("Category created successfully", category.Id);
        }
    }
}
```

### 🔍 Query Pattern (Read Operations)

**File:** `Application/Features/[Feature]/Queries/Get[Feature]ListQuery.cs`

```csharp
using Application.Models.Common;
using Domain.Repositories;
using MapsterMapper;
using MediatR;

namespace Application.Features.Categories.Queries
{
    /// <summary>
    /// Query to retrieve a paginated list of categories.
    /// Part of CQRS pattern - Read operation.
    /// </summary>
    public class GetCategoriesListQuery : IRequest<Result<PagedResult<CategoryResponse>>>
    {
        public GetListParameters Parameters { get; set; }

        public GetCategoriesListQuery(GetListParameters parameters)
        {
            Parameters = parameters;
        }
    }

    /// <summary>
    /// Handler for GetCategoriesListQuery.
    /// Retrieves and maps data to DTOs.
    /// </summary>
    public class GetCategoriesListQueryHandler : IRequestHandler<GetCategoriesListQuery, Result<PagedResult<CategoryResponse>>>
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;

        public GetCategoriesListQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
        {
            _repositoryManager = repositoryManager;
            _mapper = mapper;
        }

        public async Task<Result<PagedResult<CategoryResponse>>> Handle(GetCategoriesListQuery request, CancellationToken cancellationToken)
        {
            // 1. Get data from repository (no tracking for read-only)
            var pagedCategories = await _repositoryManager.CategoryRepository
                .GetListAsync(
                    request.Parameters.Page,
                    request.Parameters.PageSize,
                    request.Parameters?.SearchTerm ?? string.Empty,
                    trackChanges: false,
                    cancellationToken
                );

            // 2. Map to DTOs
            var mappedCategories = _mapper.Map<IReadOnlyList<CategoryResponse>>(pagedCategories.categories);

            // 3. Create paginated result
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
```

### 🏛️ Domain Entity Pattern

**File:** `Domain/Entities/[EntityName].cs`

```csharp
using Domain.Abstractions;

namespace Domain.Entities
{
    /// <summary>
    /// Category entity following DDD principles.
    /// Business logic encapsulated in the entity.
    /// </summary>
    public class Category : BaseEntity
    {
        // Properties with private setters (encapsulation)
        public string Name { get; private set; }
        public string Description { get; private set; }
        public int DisplayOrder { get; private set; }

        // Navigation properties
        public ICollection<Product> Products { get; private set; } = new List<Product>();

        // Constructor with validation
        public Category(string name, string description, int displayOrder)
        {
            // Business rule validation
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Category name is required", nameof(name));

            if (name.Length > 100)
                throw new ArgumentException("Category name cannot exceed 100 characters", nameof(name));

            if (displayOrder < 0)
                throw new ArgumentException("Display order must be non-negative", nameof(displayOrder));

            Name = name;
            Description = description ?? string.Empty;
            DisplayOrder = displayOrder;
        }

        // Business methods (not setters)
        public void UpdateDetails(string name, string description, int displayOrder)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Category name is required", nameof(name));

            Name = name;
            Description = description;
            DisplayOrder = displayOrder;
        }

        public void UpdateDisplayOrder(int displayOrder)
        {
            if (displayOrder < 0)
                throw new ArgumentException("Display order must be non-negative");

            DisplayOrder = displayOrder;
        }
    }
}
```

### ✅ Validation Pattern (FluentValidation)

**File:** `Application/Features/[Feature]/Validators/Create[Feature]CommandValidator.cs`

```csharp
using FluentValidation;

namespace Application.Features.Categories.Commands
{
    public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
    {
        public CreateCategoryCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Category name is required")
                .MaximumLength(100)
                .WithMessage("Category name cannot exceed 100 characters");

            RuleFor(x => x.Description)
                .MaximumLength(500)
                .WithMessage("Description cannot exceed 500 characters");

            RuleFor(x => x.DisplayOrder)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Display order must be non-negative");
        }
    }
}
```

### 🎮 Controller Pattern

**File:** `Presentation/Host/Controllers/[Feature]Controller.cs`

```csharp
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
    /// API controller for managing categories.
    /// Thin controller - delegates to MediatR handlers.
    /// </summary>
    [ApiController]
    [ApiVersion(1)]
    [Route("api/v{v:apiVersion}/categories")]
    [Produces("application/json")]
    public class CategoryController : BaseController
    {
        /// <summary>
        /// Retrieves a category by ID.
        /// </summary>
        [ProducesResponseType(typeof(Result<CategoryResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("{id}", Name = "GetCategoryById")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var query = new GetCategoryByIdQuery(id);
            var result = await Mediator.Send(query, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves paginated list of categories.
        /// </summary>
        [ProducesResponseType(typeof(Result<PagedResult<CategoryResponse>>), StatusCodes.Status200OK)]
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
        [ProducesResponseType(typeof(Result<Guid>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPost(Name = "CreateCategory")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(request, cancellationToken);
            return CreatedAtRoute("GetCategoryById", new { id = result.Data }, result);
        }

        /// <summary>
        /// Updates an existing category.
        /// </summary>
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [HttpPut("{id}", Name = "UpdateCategory")]
        public async Task<IActionResult> Update(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(request, cancellationToken);
            return Ok(result);
        }

        /// <summary>
        /// Deletes a category.
        /// </summary>
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [HttpDelete("{id}", Name = "DeleteCategory")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var command = new DeleteCategoryCommand(id);
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
    }
}
```

### 📦 Repository Pattern

**Repository Interface:**

```csharp
namespace Domain.Repositories
{
    public interface ICategoryRepository
    {
        Task<Category?> GetByIdAsync(Guid id, bool trackChanges, CancellationToken cancellationToken = default);
        Task<Category?> GetByNameAsync(string name, bool trackChanges, CancellationToken cancellationToken = default);
        Task<(IReadOnlyList<Category> categories, int totalCounts)> GetListAsync(
            int page,
            int pageSize,
            string searchTerm,
            bool trackChanges,
            CancellationToken cancellationToken = default
        );
        Task AddAsync(Category category);
        void Update(Category category);
        void Delete(Category category);
    }
}
```

**Repository Manager (Unit of Work):**

```csharp
namespace Domain.Repositories
{
    public interface IRepositoryManager
    {
        ICategoryRepository CategoryRepository { get; }
        IProductRepository ProductRepository { get; }
        IToppingRepository ToppingRepository { get; }
        IVoucherRepository VoucherRepository { get; }
        IOrderRepository OrderRepository { get; }

        Task SaveAsync(CancellationToken cancellationToken = default);
        Task DisposeAsync();
    }
}
```

### 🔄 Result Pattern (Response Wrapper)

```csharp
namespace Application.Models.Common
{
    // Base result interface
    public interface IResult
    {
        bool IsSuccess { get; set; }
        string? Message { get; set; }
    }

    // Generic result with data
    public interface IResult<T> : IResult
    {
        T Data { get; set; }
    }

    // Simple result without data
    public class Result : IResult
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }

        private Result(bool success, string? message)
        {
            IsSuccess = success;
            Message = message;
        }

        public static Result Success(string? message) => new Result(true, message);
        public static Result Failure(string? message) => new Result(false, message);
    }

    // Result with data
    public class Result<T> : IResult<T>
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public T Data { get; set; }

        private Result(bool success, string? message, T data)
        {
            IsSuccess = success;
            Message = message;
            Data = data;
        }

        public static Result<T> Success(string? message, T data) => new Result<T>(true, message, data);
        public static Result<T> Failure(string? message, T data) => new Result<T>(false, message, data);
    }
}
```

### 📄 Pagination Pattern

```csharp
namespace Application.Models.Common
{
    public class PagedResult<T>
    {
        public IReadOnlyList<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage => PageNumber < TotalPages;
        public bool HasPreviousPage => PageNumber > 1;

        public PagedResult(IReadOnlyList<T> items, int totalCount, int pageNumber, int pageSize, int totalPages)
        {
            Items = items;
            TotalCount = totalCount;
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalPages = totalPages;
        }
    }

    public class GetListParameters
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public string? SortDirection { get; set; } = "asc";
    }
}
```

### 🔧 Dependency Injection Pattern

**Application Layer DI:**

```csharp
namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // Register Mapster
            services.AddMapster();

            // Register MediatR (auto-scan handlers)
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

            // Register FluentValidation
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            // Register application services
            services.AddScoped<ICurrentUserService, CurrentUserService>();

            return services;
        }
    }
}
```

**Infrastructure Layer DI:**

```csharp
namespace Infrastructures
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            // Database
            services.AddDbContext<ApplicationDbContext>(opts =>
            {
                opts.UseSqlServer(config.GetConnectionString("sqlConnection"));
            });

            // Repositories
            services.AddScoped<IRepositoryManager, RepositoryManager>();

            // Services
            services.AddScoped<IJwtManager, JwtManager>();
            services.AddScoped<IImageOptimizationService, ImageOptimizationService>();

            return services;
        }
    }
}
```

---

## 🔷 Frontend (React) Conventions

### 🏗️ Kiến trúc: Feature-Based Architecture

```
src/
├── components/       # Reusable UI components
│   ├── layout/      # Layout components (AdminLayout, RootLayout, Sidebar)
│   └── ui/          # Base UI components (Shadcn + Custom)
│       ├── button/          # Button variants
│       ├── table/           # DataTable component
│       ├── select/          # CommonSelect component
│       ├── pagination/      # Pagination component
│       ├── page/            # Page wrapper component
│       ├── dialog/          # Dialog/Modal components
│       ├── form.tsx         # Form components from react-hook-form
│       ├── input/           # Input components
│       ├── loading/         # Loading indicators
│       ├── empty-data/      # Empty state component
│       └── ...              # Other UI components
├── features/        # Feature modules (business logic)
│   └── [feature]/
│       ├── components/  # Feature-specific components (Forms, Dialogs)
│       ├── hooks/       # Custom hooks (use[Feature].ts, use[Feature]Page.ts)
│       └── schema/      # Validation schemas (Zod)
├── models/          # TypeScript types (organized by feature)
│   └── [feature]/
│       ├── request/     # Request types
│       ├── response/    # Response types
│       ├── entity/      # Entity types (optional)
│       └── index.ts     # Export all types
├── services/        # API service classes
├── pages/           # Page components (thin, only render UI)
├── providers/       # Context providers
├── router/          # Routing configuration
└── lib/             # Utilities
```

### 📝 Naming Conventions

#### 1. **Files & Folders**

```
// ✅ ĐÚNG
components/UserTable.tsx         # PascalCase for components
hooks/useUser.ts                 # camelCase with 'use' prefix
services/userService.ts          # camelCase with 'Service' suffix
models/user/entity/user.ts       # camelCase for files

// ❌ SAI
components/user-table.tsx
hooks/UserHook.ts
services/user-service.ts
```

#### 2. **Components**

```typescript
// ✅ ĐÚNG - PascalCase, descriptive names
export const UserTable = () => {};
export const CreateUserDialog = () => {};
export const UserStatusBadge = () => {};

// ❌ SAI
export const userTable = () => {};
export const createUser = () => {};
```

#### 3. **Hooks**

```typescript
// ✅ ĐÚNG - camelCase with 'use' prefix
export const useUser = () => {};
export const useCategory = () => {};
export const useAuth = () => {};

// ❌ SAI
export const UserHook = () => {};
export const getUser = () => {};
```

#### 4. **Variables & Functions**

```typescript
// ✅ ĐÚNG - camelCase
const userName = "John";
const handleSubmit = () => {};
const fetchUserData = async () => {};

// ❌ SAI
const UserName = "John";
const HandleSubmit = () => {};
```

---

### 🎯 Feature Implementation Rules

#### 1. **Feature Folder Structure** (BẮT BUỘC)

Mỗi feature phải tuân theo cấu trúc:

```
features/{feature}/
├── hooks/
│   ├── use{Feature}.ts          # Main hook: CRUD, fetch, pagination, search, sort
│   ├── use{Feature}Page.ts      # Page state management: dialogs, selected items
│   └── use{Feature}{Action}.ts  # Specific action hooks (optional)
├── components/
│   └── Form{Feature}Dialog.tsx  # Form components (minimal logic)
└── schema/
    └── {feature}Schema.ts       # Validation schemas
```

**Example:**

```
features/news/
├── hooks/
│   ├── useNews.ts           # Main CRUD operations
│   ├── useNewsPage.ts       # UI state management
│   └── useNewsUpload.ts     # Optional specific action
├── components/
│   └── FormNewsDialog.tsx   # Create/Edit form
└── schema/
    └── newsSchema.ts        # Zod validation
```

#### 2. **Hooks Organization Rules** (BẮT BUỘC)

**⚠️ QUAN TRỌNG: KHÔNG đặt logic business trong component. Tách ra hooks.**

**Naming Convention:**

- Main hook: `use{Feature}` (e.g., `useNews`, `useReels`)
- Page hook: `use{Feature}Page` (e.g., `useNewsPage`)
- Action hook: `use{Feature}{Action}` (e.g., `useReelsUpload`, `useFileUpload`)

**Hook Responsibilities:**

**A. `use{Feature}.ts` - Main Business Logic Hook:**

```typescript
// File: features/news/hooks/useNews.ts
export function useNews() {
  // ✅ Data fetching (list, getById)
  // ✅ CRUD operations (create, update, delete)
  // ✅ Pagination, search, sort logic
  // ✅ Try-catch error handling
  // ✅ Toast notifications
  // ❌ KHÔNG set loading state (use global loading in redux)

  const fetchNews = async (params) => {
    try {
      const response = await newsService.getList(params);
      if (response.isSuccess) {
        toast.success("News fetched successfully");
        return response.data;
      }
    } catch (error) {
      toast.error("Failed to fetch news");
      console.error(error);
    }
  };

  return { fetchNews, createNews, updateNews, deleteNews };
}
```

**B. `use{Feature}Page.ts` - UI State Management Hook:**

```typescript
// File: features/news/hooks/useNewsPage.ts
export function useNewsPage() {
  // ✅ Dialog open/close states
  // ✅ Selected item management
  // ✅ UI state coordination

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const handleCreate = () => {
    setSelectedNews(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (news) => {
    setSelectedNews(news);
    setIsDialogOpen(true);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    selectedNews,
    handleCreate,
    handleEdit,
  };
}
```

**C. `use{Feature}{Action}.ts` - Specific Action Hook (Optional):**

```typescript
// File: features/reels/hooks/useReelsUpload.ts
export function useReelsUpload() {
  // ✅ Complex operations (upload, export, etc.)
  // ✅ Reusable logic that can be shared

  const uploadReel = async (file) => {
    try {
      // Upload logic
      toast.success("Reel uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload reel");
    }
  };

  return { uploadReel };
}
```

#### 3. **Model Organization Rules** (BẮT BUỘC)

**⚠️ QUAN TRỌNG:**

- **KHÔNG** đặt nhiều types trong 1 file. Mỗi type phải có file riêng.
- **KHÔNG** export nhiều types từ cùng 1 file (trừ index.ts).

**Folder Structure:**

```
models/{feature}/
├── request/          # Request types (Create, Update, etc.)
│   ├── create-{entity}-request.ts
│   ├── update-{entity}-request.ts
│   └── get-{entity}-request.ts (if needed)
├── response/         # Response types
│   ├── {entity}-detail.ts        # Single entity response
│   ├── {entity}-list-response.ts # List response
│   └── {other}-response.ts
├── entity/           # Entity types (optional, shared between request/response)
│   └── {entity}.ts
└── index.ts          # Export all types from here
```

**Naming Convention:**

- Request: `{Action}{Entity}Request` (e.g., `CreateReelRequest`, `UpdateReelRequest`)
- Response Detail: `{Entity}Detail` (e.g., `ReelDetail`, `NewsDetail`)
- Response List: `{Entity}ListResponse` (e.g., `ReelListResponse`)
- Entity: `{Entity}` (e.g., `Reel`, `News`)

**File Structure Examples:**

✅ **ĐÚNG:**

```typescript
// models/reels/request/create-reel-request.ts
export type CreateReelRequest = {
  title: string;
  description: string;
};

// models/reels/response/reel-detail.ts
export type ReelDetail = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

// models/reels/index.ts
export type { CreateReelRequest } from "./request/create-reel-request";
export type { UpdateReelRequest } from "./request/update-reel-request";
export type { ReelDetail } from "./response/reel-detail";
export type { ReelListResponse } from "./response/reel-list-response";
```

❌ **SAI:**

```typescript
// models/reels/reel.ts - KHÔNG đặt nhiều types trong 1 file
export type Reel = { ... }
export type CreateReelRequest = { ... }
export type ReelListResponse = { ... }
```

**Import Rules:**

- **Ưu tiên**: Import từ `@/models/{feature}` (index.ts) nếu có index.ts.
- **Cho phép**: Import trực tiếp từ file con nếu model chưa có index.ts (để tương thích với code cũ).

```typescript
// ✅ Tốt nhất: Import từ index.ts
import type { ReelDetail, CreateReelRequest } from "@/models/reels";

// ✅ Chấp nhận được: Import trực tiếp (nếu chưa có index.ts)
import type { NewsDetail } from "@/models/news/response/news-detail";
```

**Backward Compatibility:**
Có thể export alias trong index.ts để tương thích ngược (deprecated):

```typescript
// models/reels/index.ts
export type { ReelDetail } from "./response/reel-detail";
export type { ReelDetail as Reel } from "./response/reel-detail"; // Deprecated alias
```

#### 4. **Component Responsibilities** (BẮT BUỘC)

**A. Page Components (`pages/`):**

- ✅ Chỉ render UI
- ✅ Sử dụng hooks để lấy data và logic
- ✅ Coordinate giữa các components
- ❌ KHÔNG chứa business logic
- ❌ KHÔNG gọi services trực tiếp

```typescript
// ✅ ĐÚNG: Page component sạch, chỉ render
export default function NewsPage() {
  const { news, fetchNews, deleteNews } = useNews();
  const { isDialogOpen, selectedNews, handleCreate, handleEdit } = useNewsPage();

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <Page title="News Management">
      <DataTable data={news} onEdit={handleEdit} onDelete={deleteNews} />
      <FormNewsDialog open={isDialogOpen} news={selectedNews} />
    </Page>
  );
}

// ❌ SAI: Logic trong component
export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => { // ❌ KHÔNG nên - logic phải trong hook
    setLoading(true);
    try {
      const response = await newsService.getList();
      setNews(response.data);
    } catch (error) {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return <Page>...</Page>;
}
```

**B. Form Components (`features/{feature}/components/`):**

- ✅ Form rendering
- ✅ Form validation (via schema)
- ✅ Minimal submit logic (có thể gọi hooks)
- ❌ KHÔNG chứa business logic phức tạp
- ❌ KHÔNG gọi services trực tiếp

```typescript
// ✅ ĐÚNG: Form component minimal logic
export function FormNewsDialog({ open, onClose, news }) {
  const { createNews, updateNews } = useNews(); // Sử dụng hook
  const form = useForm({ resolver: zodResolver(newsSchema) });

  const onSubmit = async (data) => {
    news ? await updateNews(news.id, data) : await createNews(data);
    onClose();
  };

  return <Dialog>...</Dialog>;
}
```

#### 5. **Using Existing Shared Components** (BẮT BUỘC)

**⚠️ QUAN TRỌNG: Luôn ưu tiên sử dụng các component có sẵn trong `@/components/ui`**

**Available Components:**

**A. DataTable Component** - For list/table views:

```typescript
import { DataTable } from '@/components/ui/table/data-table';

// Usage example
<DataTable
  dataSource={items}
  columns={columns}
  pageNumber={page}
  pageSize={pageSize}
  totalItems={total}
  pageSizeOptions={[10, 20, 50]}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
  onSort={handleSort}
  sortConfig={sortConfig}
  onRefresh={handleRefresh}
/>
```

**B. Page Component** - For page wrapper:

```typescript
import Page from '@/components/ui/page/page';

// Usage example
<Page title="News Management">
  {children}
</Page>
```

**C. CommonSelect Component** - For select/dropdown:

```typescript
import { CommonSelect } from '@/components/ui/select/CommonSelect';

// Usage with form
<CommonSelect
  control={form.control}
  name="categoryId"
  label="Category"
  placeholder="Select category"
  groups={categoryOptions}
  required
/>
```

**D. Pagination Component** - For pagination:

```typescript
import Pagination from '@/components/ui/pagination/Pagination';

// Usage example
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  pageSize={pageSize}
  onPageSizeChange={setPageSize}
/>
```

**E. Button Component** - For buttons:

```typescript
import { Button } from '@/components/ui/button';

// Usage example
<Button variant="default" size="sm" onClick={handleClick}>
  Click Me
</Button>
```

**F. Dialog Component** - For modals/dialogs:

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Usage example
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {children}
  </DialogContent>
</Dialog>
```

**G. Form Components** - For form inputs:

```typescript
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Usage with react-hook-form
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

**H. Loading Component** - For loading states:

```typescript
import { Loading } from '@/components/ui/loading';

// Usage example
{loading && <Loading />}
```

**I. Empty Data Component** - For empty states:

```typescript
import { EmptyData } from '@/components/ui/empty-data';

// Usage example
{items.length === 0 && <EmptyData message="No data found" />}
```

**Other Available Components:**

- `Checkbox` - For checkboxes
- `RadioButton` - For radio buttons
- `Tabs` - For tab navigation
- `Typography` - For text styling
- `Accordion` - For collapsible content
- `RichTextEditor` - For rich text editing
- `ImagePreview` - For image preview
- `DropdownMenu` - For dropdown menus
- `Label` - For form labels

**Before Creating New Components:**

1. ✅ Check if similar component exists in `@/components/ui`
2. ✅ Try to compose/extend existing components
3. ✅ Only create new component if truly unique to feature
4. ❌ DO NOT recreate table, pagination, form components

#### 6. **Utility Functions**

- Đặt trong `lib/` hoặc `utils/` nếu reusable across features
- Ví dụ: `formatFileSize`, `validateImage`, `formatDate`, etc.

```typescript
// lib/formatters.ts
export function formatFileSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
}
```

---

### 📝 Implementation Workflow

**When implementing a new feature, follow this checklist:**

1. **Create Feature Folder Structure:**

   ```
   features/{feature}/
   ├── hooks/
   ├── components/
   └── schema/
   ```

2. **Create Models:**

   ```
   models/{feature}/
   ├── request/
   ├── response/
   └── index.ts
   ```

3. **Create Service:**

   ```typescript
   // services/{feature}Service.ts
   class FeatureService {
     async getList() { ... }
     async create() { ... }
     async update() { ... }
     async delete() { ... }
   }
   ```

4. **Create Validation Schema:**

   ```typescript
   // features/{feature}/schema/{feature}Schema.ts
   import { z } from "zod";
   export const featureSchema = z.object({ ... });
   ```

5. **Create Main Hook:**

   ```typescript
   // features/{feature}/hooks/use{Feature}.ts
   export function useFeature() {
     // Implement CRUD operations with try-catch and toast
   }
   ```

6. **Create Page Hook (optional):**

   ```typescript
   // features/{feature}/hooks/use{Feature}Page.ts
   export function useFeaturePage() {
     // Manage UI states (dialogs, selected items)
   }
   ```

7. **Create Form Component:**

   ```typescript
   // features/{feature}/components/Form{Feature}Dialog.tsx
   // Use existing Dialog, Form, Input components
   ```

8. **Create Page Component:**
   ```typescript
   // pages/{feature}/{feature}.tsx
   // Use existing DataTable, Page, Button components
   // Only render UI, use hooks for logic
   ```

---

### 🎯 Feature Module Structure

**Example: User Management Feature**

```
features/users/
├── components/              # Feature-specific components
│   ├── UserTable.tsx       # Data table component
│   └── FormUserDialog.tsx  # Create/Edit dialog
├── hooks/                   # Custom hooks for business logic
│   ├── useUser.ts          # User CRUD operations
│   └── useUserPage.ts      # UI state management
└── schema/                  # Validation schemas
    └── userSchema.ts       # Zod validation schemas
```

---

### 🪝 Custom Hook Pattern

#### Main Hook Pattern: `use{Feature}.ts`

**File:** `features/[feature]/hooks/use[Feature].ts`

**Rules:**

- ✅ Always add try-catch when calling services
- ❌ Don't set loading in hooks, use global loading in Redux only
- ✅ Use toast to notify success/error/warning in try-catch
- ✅ Write hooks for get list, search, filter, refresh
- ✅ Create/Update/Delete is optional
- ✅ Return functions and data, not loading state

```typescript
import { useState } from "react";
import { toast } from "@/lib/toast";
import { categoryService } from "@/services/categoryService";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryDetail,
  CategoryListResponse,
} from "@/models/category";

/**
 * Main hook for category management
 * Handles all CRUD operations with error handling and notifications
 */
export const useCategory = () => {
  const [categories, setCategories] = useState<CategoryDetail[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDetail | null>(null);

  /**
   * Fetch paginated list of categories
   * @param page - Page number
   * @param pageSize - Items per page
   * @param searchTerm - Search keyword
   */
  const fetchCategories = async (
    page: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
  ) => {
    try {
      const response = await categoryService.getList({
        page,
        pageSize,
        searchTerm,
      });

      if (response.isSuccess) {
        setCategories(response.data.items);
        toast.success("Categories loaded successfully");
        return response.data;
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error("Fetch categories error:", error);
    }
  };

  /**
   * Search and filter categories
   * @param filters - Filter parameters
   */
  const searchCategories = async (filters: {
    searchTerm?: string;
    status?: string;
  }) => {
    try {
      const response = await categoryService.search(filters);

      if (response.isSuccess) {
        setCategories(response.data.items);
        toast.success(`Found ${response.data.totalCount} categories`);
        return response.data;
      }
    } catch (error) {
      toast.error("Search failed");
      console.error("Search categories error:", error);
    }
  };

  /**
   * Refresh category list
   */
  const refreshCategories = async () => {
    try {
      await fetchCategories();
      toast.success("Categories refreshed");
    } catch (error) {
      toast.error("Failed to refresh");
      console.error("Refresh error:", error);
    }
  };

  /**
   * Create new category (OPTIONAL)
   */
  const createCategory = async (data: CreateCategoryRequest) => {
    try {
      const response = await categoryService.create(data);

      if (response.isSuccess) {
        toast.success("Category created successfully");
        await refreshCategories(); // Refresh list after create
        return response.data;
      }
    } catch (error) {
      toast.error("Failed to create category");
      console.error("Create category error:", error);
      throw error;
    }
  };

  /**
   * Update existing category (OPTIONAL)
   */
  const updateCategory = async (id: string, data: UpdateCategoryRequest) => {
    try {
      const response = await categoryService.update(id, data);

      if (response.isSuccess) {
        toast.success("Category updated successfully");
        await refreshCategories(); // Refresh list after update
        return response.data;
      }
    } catch (error) {
      toast.error("Failed to update category");
      console.error("Update category error:", error);
      throw error;
    }
  };

  /**
   * Delete category (OPTIONAL)
   */
  const deleteCategory = async (id: string) => {
    try {
      const response = await categoryService.delete(id);

      if (response.isSuccess) {
        toast.success("Category deleted successfully");
        await refreshCategories(); // Refresh list after delete
        return true;
      }
      return false;
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Delete category error:", error);
      throw error;
    }
  };

  /**
   * Get category by ID
   */
  const getCategoryById = async (id: string) => {
    try {
      const response = await categoryService.getById(id);

      if (response.isSuccess) {
        setSelectedCategory(response.data);
        return response.data;
      }
    } catch (error) {
      toast.error("Failed to fetch category details");
      console.error("Get category error:", error);
    }
  };

  return {
    // Data
    categories,
    selectedCategory,

    // Methods - Required
    fetchCategories,
    searchCategories,
    refreshCategories,

    // Methods - Optional (CRUD)
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
};
```

#### Page Hook Pattern: `use{Feature}Page.ts`

**File:** `features/[feature]/hooks/use[Feature]Page.ts`

```typescript
import { useState } from "react";
import type { CategoryDetail } from "@/models/category";

/**
 * Hook for managing category page UI state
 * Handles dialogs, selected items, and UI interactions
 */
export const useCategoryPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDetail | null>(null);

  /**
   * Open create dialog
   */
  const handleCreate = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  /**
   * Open edit dialog
   */
  const handleEdit = (category: CategoryDetail) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  /**
   * Open delete confirmation dialog
   */
  const handleDeleteClick = (category: CategoryDetail) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Close all dialogs and reset state
   */
  const closeDialogs = () => {
    setIsDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  return {
    // Dialog states
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Selected item
    selectedCategory,
    setSelectedCategory,

    // Actions
    handleCreate,
    handleEdit,
    handleDeleteClick,
    closeDialogs,
  };
};
```

---

### 🎨 Component Pattern with Existing UI Components

#### Page Component Pattern

**File:** `pages/[feature]/[feature].tsx`

**Rules:**

- ✅ Use existing components from `@/components/ui`
- ✅ Use hooks for all business logic
- ✅ Only render UI, coordinate components
- ❌ NO business logic in page component

```typescript
import { useEffect, useState } from 'react';
import Page from '@/components/ui/page/page';
import { DataTable, ColumnDefinition } from '@/components/ui/table/data-table';
import { Button } from '@/components/ui/button';
import { useCategory } from '@/features/categories/hooks/useCategory';
import { useCategoryPage } from '@/features/categories/hooks/useCategoryPage';
import { FormCategoryDialog } from '@/features/categories/components/FormCategoryDialog';
import type { CategoryDetail } from '@/models/category';

export default function CategoryPage() {
  // Hooks for business logic
  const {
    categories,
    fetchCategories,
    deleteCategory,
    searchCategories,
    refreshCategories,
  } = useCategory();

  // Hooks for UI state
  const {
    isDialogOpen,
    selectedCategory,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    closeDialogs,
  } = useCategoryPage();

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Fetch data on mount and when filters change
  useEffect(() => {
    const loadData = async () => {
      const result = await fetchCategories(page, pageSize);
      if (result) {
        setTotalItems(result.totalCount);
      }
    };
    loadData();
  }, [page, pageSize]);

  // Table columns configuration
  const columns: ColumnDefinition<CategoryDetail>[] = [
    {
      key: 'name',
      title: 'Name',
      render: (item) => item.name,
      sortable: true,
    },
    {
      key: 'description',
      title: 'Description',
      render: (item) => item.description || '-',
    },
    {
      key: 'displayOrder',
      title: 'Display Order',
      render: (item) => item.displayOrder,
      sortable: true,
      width: '120px',
      justify: 'center',
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (item) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit(item)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteClick(item)}
          >
            Delete
          </Button>
        </div>
      ),
      width: '150px',
      justify: 'center',
    },
  ];

  // Handle page change
  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize) setPageSize(newPageSize);
  };

  // Handle sort
  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    // Implement sort logic or pass to API
  };

  // Handle dialog close and refresh
  const handleDialogClose = () => {
    closeDialogs();
    refreshCategories();
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory.id);
      closeDialogs();
    }
  };

  return (
    <Page title="Category Management">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {/* Search, filters, etc. */}
        </div>
        <Button onClick={handleCreate}>
          Create Category
        </Button>
      </div>

      {/* Data Table - Using existing component */}
      <DataTable
        dataSource={categories}
        columns={columns}
        pageNumber={page}
        pageSize={pageSize}
        totalItems={totalItems}
        pageSizeOptions={[10, 20, 50, 100]}
        onPageChange={handlePageChange}
        onPageSizeChange={setPageSize}
        onSort={handleSort}
        sortConfig={sortConfig}
        onRefresh={refreshCategories}
      />

      {/* Form Dialog - Feature-specific component */}
      <FormCategoryDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        category={selectedCategory}
      />

      {/* Delete Confirmation Dialog */}
      {/* Implementation here */}
    </Page>
  );
}
```

---

### 📝 Form Dialog Pattern with Existing Components

**File:** `features/[feature]/components/Form[Feature]Dialog.tsx`

```typescript
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCategory } from '../hooks/useCategory';
import { categorySchema, type CategoryFormValues } from '../schema/categorySchema';
import type { CategoryDetail } from '@/models/category';

interface FormCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: CategoryDetail | null;
}

export const FormCategoryDialog = ({ open, onClose, category }: FormCategoryDialogProps) => {
  // Use hook for business logic
  const { createCategory, updateCategory } = useCategory();

  // Initialize form with validation
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      displayOrder: 0,
    },
  });

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description,
        displayOrder: category.displayOrder,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        displayOrder: 0,
      });
    }
  }, [category, open, form]);

  // Handle form submission
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (category) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }
      onClose();
    } catch (error) {
      // Error already handled in hook with toast
      console.error('Form submission error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Create Category'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Category description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Order Field */}
            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {category ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
```

---

### 🪝 Custom Hook Pattern

**File:** `features/[feature]/hooks/use[Feature].ts`

````typescript
import { useState } from "react";
import { toast } from "@/lib/toast";
import { categoryService } from "@/services/categoryService";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
} from "@/models/category";

export const useCategory = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

---

### ✅ Validation Schema Pattern (Zod)

**File:** `features/[feature]/schema/[feature]Schema.ts`

```typescript
import { z } from "zod";

/**
 * Category validation schema
 * Used with react-hook-form for form validation
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  displayOrder: z
    .number()
    .min(0, "Display order must be non-negative")
    .default(0),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
````

---

### 🔌 Service Layer Pattern

**File:** `services/[feature]Service.ts`

```typescript
import { apiClient } from "@/lib/api";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryDetail,
  CategoryListResponse,
} from "@/models/category";
import type {
  ApiResponse,
  PagedResult,
  GetListParameters,
} from "@/models/common";

/**
 * Category service for API calls
 * Handles all HTTP requests related to categories
 */
class CategoryService {
  private readonly baseUrl = "/api/v1/categories";

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<ApiResponse<CategoryDetail>> {
    const response = await apiClient.get<ApiResponse<CategoryDetail>>(
      `${this.baseUrl}/${id}`,
    );
    return response.data;
  }

  /**
   * Get paginated list of categories
   */
  async getList(
    params: GetListParameters,
  ): Promise<ApiResponse<PagedResult<CategoryDetail>>> {
    const response = await apiClient.post<
      ApiResponse<PagedResult<CategoryDetail>>
    >(`${this.baseUrl}/list`, params);
    return response.data;
  }

  /**
   * Search categories with filters
   */
  async search(filters: {
    searchTerm?: string;
    status?: string;
  }): Promise<ApiResponse<PagedResult<CategoryDetail>>> {
    const response = await apiClient.post<
      ApiResponse<PagedResult<CategoryDetail>>
    >(`${this.baseUrl}/search`, filters);
    return response.data;
  }

  /**
   * Create new category
   */
  async create(data: CreateCategoryRequest): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>(
      this.baseUrl,
      data,
    );
    return response.data;
  }

  /**
   * Update existing category
   */
  async update(
    id: string,
    data: UpdateCategoryRequest,
  ): Promise<ApiResponse<boolean>> {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `${this.baseUrl}/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `${this.baseUrl}/${id}`,
    );
    return response.data;
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
```

---

### 📦 TypeScript Models Pattern

#### Model Organization Structure

```
models/{feature}/
├── request/
│   ├── create-{entity}-request.ts
│   ├── update-{entity}-request.ts
│   └── get-{entity}-request.ts (optional)
├── response/
│   ├── {entity}-detail.ts
│   ├── {entity}-list-response.ts
│   └── {other}-response.ts
├── entity/
│   └── {entity}.ts (optional)
└── index.ts
```

#### Request Types

**File:** `models/[feature]/request/create-[entity]-request.ts`

```typescript
/**
 * Request type for creating a new category
 */
export type CreateCategoryRequest = {
  name: string;
  description?: string;
  displayOrder: number;
};
```

**File:** `models/[feature]/request/update-[entity]-request.ts`

```typescript
/**
 * Request type for updating an existing category
 */
export type UpdateCategoryRequest = {
  name: string;
  description?: string;
  displayOrder: number;
};
```

#### Response Types

**File:** `models/[feature]/response/[entity]-detail.ts`

```typescript
/**
 * Response type for a single category (detail view)
 */
export type CategoryDetail = {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
```

**File:** `models/[feature]/response/[entity]-list-response.ts`

```typescript
import type { CategoryDetail } from "./category-detail";

/**
 * Response type for category list (paginated)
 */
export type CategoryListResponse = {
  items: CategoryDetail[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
```

#### Index File (Export All)

**File:** `models/[feature]/index.ts`

```typescript
// Request types
export type { CreateCategoryRequest } from "./request/create-category-request";
export type { UpdateCategoryRequest } from "./request/update-category-request";

// Response types
export type { CategoryDetail } from "./response/category-detail";
export type { CategoryListResponse } from "./response/category-list-response";

// Backward compatibility (deprecated)
export type { CategoryDetail as Category } from "./response/category-detail";
```

#### Common Types

**File:** `models/common/api.ts`

```typescript
/**
 * Generic API response wrapper
 */
export type ApiResponse<T> = {
  isSuccess: boolean;
  message: string;
  data: T;
};

/**
 * Generic paginated result
 */
export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/**
 * Generic list parameters for API requests
 */
export type GetListParameters = {
  page: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
};
```

---

### 🔌 Service Layer Pattern

**File:** `services/[feature]Service.ts`

```typescript
import { apiClient } from "@/lib/api";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryResponse,
} from "@/models/category";
import { ApiResponse, PagedResult } from "@/models/common/api";

class CategoryService {
  private readonly baseUrl = "/api/v1/categories";

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<ApiResponse<CategoryResponse>> {
    const response = await apiClient.get<ApiResponse<CategoryResponse>>(
      `${this.baseUrl}/${id}`,
    );
    return response.data;
  }

  /**
   * Get paginated list of categories
   */
  async getList(
    page: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
  ): Promise<ApiResponse<PagedResult<CategoryResponse>>> {
    const response = await apiClient.post<
      ApiResponse<PagedResult<CategoryResponse>>
    >(`${this.baseUrl}/list`, { page, pageSize, searchTerm });
    return response.data;
  }

  /**
   * Create new category
   */
  async create(data: CreateCategoryRequest): Promise<ApiResponse<string>> {
    const response = await apiClient.post<ApiResponse<string>>(
      this.baseUrl,
      data,
    );
    return response.data;
  }

  /**
   * Update existing category
   */
  async update(
    id: string,
    data: UpdateCategoryRequest,
  ): Promise<ApiResponse<boolean>> {
    const response = await apiClient.put<ApiResponse<boolean>>(
      `${this.baseUrl}/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<ApiResponse<boolean>> {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `${this.baseUrl}/${id}`,
    );
    return response.data;
  }
}

export const categoryService = new CategoryService();
```

### 📦 TypeScript Models Pattern

**File:** `models/[feature]/entity/[feature].ts`

```typescript
export interface Category {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**File:** `models/[feature]/request/create[Feature]Request.ts`

```typescript
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  displayOrder: number;
}
```

**File:** `models/[feature]/response/[feature]Response.ts`

```typescript
export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🗄️ Database & Entity Conventions

### 📋 Table Naming

```sql
-- ✅ ĐÚNG - PascalCase, singular
CREATE TABLE Category (...)
CREATE TABLE Product (...)
CREATE TABLE OrderItem (...)

-- ❌ SAI
CREATE TABLE categories (...)
CREATE TABLE product (...)
```

### 🔑 Column Naming

```sql
-- ✅ ĐÚNG - PascalCase
Id UNIQUEIDENTIFIER PRIMARY KEY
Name NVARCHAR(100) NOT NULL
CreatedAt DATETIME2 NOT NULL
IsActive BIT NOT NULL

-- ❌ SAI
id uniqueidentifier
product_name nvarchar(100)
created_at datetime2
```

### 🔗 Foreign Key Naming

```sql
-- ✅ ĐÚNG - [EntityName]Id
CategoryId UNIQUEIDENTIFIER NOT NULL
ProductId UNIQUEIDENTIFIER NOT NULL

-- ❌ SAI
Category_Id
category_id
```

---

## 🌐 API Design Conventions

### 📍 Endpoint Naming

```
✅ ĐÚNG:
GET    /api/v1/categories           # Get list
GET    /api/v1/categories/{id}      # Get by ID
POST   /api/v1/categories           # Create
PUT    /api/v1/categories/{id}      # Update
DELETE /api/v1/categories/{id}      # Delete
PATCH  /api/v1/categories/{id}/toggle-status  # Partial update

❌ SAI:
GET    /api/v1/GetCategories
POST   /api/v1/CreateCategory
GET    /api/v1/category/{id}        # Should be plural
```

### 📤 Response Format

**Success Response:**

```json
{
  "isSuccess": true,
  "message": "Category created successfully",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Drinks",
    "description": "Beverages and drinks",
    "displayOrder": 1
  }
}
```

**Paginated Response:**

```json
{
    "isSuccess": true,
    "message": "Categories retrieved successfully",
    "data": {
        "items": [...],
        "totalCount": 50,
        "pageNumber": 1,
        "pageSize": 10,
        "totalPages": 5,
        "hasNextPage": true,
        "hasPreviousPage": false
    }
}
```

**Error Response:**

```json
{
  "isSuccess": false,
  "message": "Category not found",
  "errors": [
    {
      "field": "id",
      "message": "Category with ID '...' does not exist"
    }
  ]
}
```

---

## ⚠️ Error Handling Patterns

### Backend Custom Exceptions

```csharp
// NotFoundException (404)
throw new NotFoundException("Category not found", "CATEGORY.NOTFOUND");

// ConflictException (409)
throw new ConflictException($"Category with name '{name}' already exists", "CATEGORY.DUPLICATE");

// BadRequestException (400)
throw new BadRequestException("Invalid request data", "INVALID.REQUEST");

// UnauthorizedException (401)
throw new UnauthorizedException("Authentication required", "AUTH.REQUIRED");

// ForbiddenException (403)
throw new ForbiddenException("Insufficient permissions", "AUTH.FORBIDDEN");

// ValidationException (400)
throw new ValidationException("Validation failed", errors);
```

### Frontend Error Handling

```typescript
try {
  const response = await categoryService.create(data);

  if (response.isSuccess) {
    toast.success(response.message);
    return response.data;
  }
} catch (error: any) {
  // API error with response
  if (error.response) {
    const apiError = error.response.data;
    toast.error(apiError.message || "An error occurred");

    // Display validation errors
    if (apiError.errors && Array.isArray(apiError.errors)) {
      apiError.errors.forEach((err: any) => {
        toast.error(`${err.field}: ${err.message}`);
      });
    }
  }
  // Network error
  else if (error.request) {
    toast.error("Network error. Please check your connection.");
  }
  // Other errors
  else {
    toast.error("An unexpected error occurred");
  }

  console.error("Error:", error);
  throw error;
}
```

---

## 🧪 Testing Guidelines

### Backend Unit Tests

```csharp
[Fact]
public async Task CreateCategory_WithValidData_ShouldReturnSuccess()
{
    // Arrange
    var command = new CreateCategoryCommand
    {
        Name = "Test Category",
        Description = "Test Description",
        DisplayOrder = 1
    };

    // Act
    var result = await _handler.Handle(command, CancellationToken.None);

    // Assert
    Assert.True(result.IsSuccess);
    Assert.NotEqual(Guid.Empty, result.Data);
}

[Fact]
public async Task CreateCategory_WithDuplicateName_ShouldThrowConflictException()
{
    // Arrange
    var command = new CreateCategoryCommand
    {
        Name = "Existing Category",
        Description = "Test",
        DisplayOrder = 1
    };

    // Act & Assert
    await Assert.ThrowsAsync<ConflictException>(
        () => _handler.Handle(command, CancellationToken.None)
    );
}
```

### Frontend Component Tests

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CategoryTable } from './CategoryTable';

describe('CategoryTable', () => {
    it('should render categories list', async () => {
        render(<CategoryTable />);

        await waitFor(() => {
            expect(screen.getByText('Drinks')).toBeInTheDocument();
            expect(screen.getByText('Food')).toBeInTheDocument();
        });
    });

    it('should open create dialog when clicking create button', () => {
        render(<CategoryTable />);

        const createButton = screen.getByText('Create Category');
        fireEvent.click(createButton);

        expect(screen.getByText('Create Category')).toBeInTheDocument();
    });
});
```

---

## 📚 Summary Checklist

### Backend (.NET)

- ✅ Follow Clean Architecture layers
- ✅ Use CQRS pattern (Commands/Queries)
- ✅ Implement Repository pattern với Unit of Work
- ✅ Use MediatR cho command/query handlers
- ✅ Use FluentValidation cho validation
- ✅ Wrap responses trong Result pattern
- ✅ Use Mapster cho object mapping
- ✅ Implement custom exceptions
- ✅ Add XML documentation comments
- ✅ Use dependency injection
- ✅ Follow naming conventions (PascalCase)

### Frontend (React)

**Architecture & Structure:**

- ✅ Feature-based architecture with strict folder structure
- ✅ Separate folders: `hooks/`, `components/`, `schema/` per feature
- ✅ Custom hooks cho business logic (REQUIRED: NO logic in components)
- ✅ Component composition with existing UI components
- ✅ Follow naming conventions (camelCase/PascalCase)

**Hooks Organization (BẮT BUỘC):**

- ✅ Main hook: `use{Feature}.ts` - CRUD, fetch, pagination, search, sort
- ✅ Page hook: `use{Feature}Page.ts` - Dialog states, selected items, UI coordination
- ✅ Action hook: `use{Feature}{Action}.ts` - Specific actions (optional)
- ✅ Always add try-catch when calling services
- ❌ DON'T set loading in hooks (use global loading in Redux only)
- ✅ Use toast for success/error/warning notifications
- ✅ Write hooks for get list, search, filter, refresh (required)
- ✅ Create/Update/Delete is optional

**Model Organization (BẮT BUỘC):**

- ✅ One type per file (NO multiple types in one file)
- ✅ Organize in `request/`, `response/`, `entity/` folders
- ✅ Export all types from `index.ts`
- ✅ Naming: `CreateXRequest`, `XDetail`, `XListResponse`
- ✅ Import from `@/models/{feature}` (prefer index.ts)

**Component Organization (BẮT BUỘC):**

- ✅ Page components: Only render UI, use hooks for logic
- ✅ Form components: Minimal logic, use hooks for CRUD
- ❌ NO business logic in components
- ❌ NO direct service calls in components
- ✅ Use existing UI components from `@/components/ui`

**Use Existing Shared Components (BẮT BUỘC):**

- ✅ `DataTable` - For list/table views with pagination, sort, refresh
- ✅ `Page` - For page wrapper with title
- ✅ `CommonSelect` - For select/dropdown with form integration
- ✅ `Pagination` - For pagination controls
- ✅ `Button` - For all button needs
- ✅ `Dialog` - For modals/dialogs
- ✅ `Form` components - For form inputs with validation
- ✅ `Loading` - For loading states
- ✅ `EmptyData` - For empty states
- ❌ DON'T recreate existing components

**Validation & Services:**

- ✅ Zod validation cho forms
- ✅ React Hook Form cho form management
- ✅ Service layer cho API calls (class-based, singleton)
- ✅ TypeScript types organized by feature

**Other:**

- ✅ Toast notifications for user feedback
- ✅ Error boundary for error handling
- ✅ Utility functions in `lib/` or `utils/`

---

**Document Version:** 2.0  
**Last Updated:** 27/01/2026  
**Author:** Development Team
