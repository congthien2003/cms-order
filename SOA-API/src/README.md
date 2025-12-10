# ApiStarterKit

## 📋 Giới thiệu

Đây là dự án mẫu cho .NET Web API, được tổ chức theo kiến trúc phân lớp (Clean Architecture) giúp dễ dàng mở rộng, bảo trì và phát triển các tính năng mới. Dự án áp dụng các best practices và design patterns phổ biến trong .NET development.

## 🏗️ Kiến trúc & Cấu trúc thư mục

Dự án được tổ chức theo kiến trúc Clean Architecture với các layer rõ ràng:

```
ApiStarterKit.sln
├── Core/                           # Core Business Logic
│   ├── Application/                # Application Services & Business Logic
│   │   ├── Authentication/         # JWT Authentication
│   │   ├── Services/               # Business Services
│   │   ├── Mapping/                # AutoMapper Profiles
│   │   └── DependencyInjection.cs  # DI Configuration
│   └── Domain/                     # Domain Models & Interfaces
│       ├── Entities/               # Domain Entities
│       ├── Identity/               # User & Role Models
│       ├── IRepositories/          # Repository Interfaces
│       └── ErrorModel/             # Error Handling Models
├── Infrastructure/                 # External Concerns
│   ├── Infrastructures/            # Data Access & Infrastructure
│   │   ├── DbContext/              # Entity Framework Context
│   │   ├── Repositories/           # Repository Implementations
│   │   └── Authentication/         # JWT Implementation
│   └── Integrations/               # External Services
│       ├── AzureBlob/              # Azure Blob Storage
│       ├── Email/                  # Email Service
│       ├── Redis/                  # Redis Caching
│       └── ImageOptimization/      # Image Processing
├── Presentation/                   # API Layer
│   ├── Host/                       # Main API
│   │   ├── Controllers/            # API Controllers
│   │   ├── Extensions/             # Middleware & Extensions
│   │   └── Program.cs              # Application Entry Point
│   └── Webhook/                    # Webhook API
└── Shared/                         # Shared Components
    └── Shared/
        ├── DTOs/                   # Data Transfer Objects
        ├── Exceptions/             # Custom Exceptions
        ├── Helpers/                # Utility Classes
        └── Commons/                # Common Models
```

## 🛠️ Công nghệ sử dụng

### Core Framework

-   **.NET 9.0** - Latest .NET version
-   **ASP.NET Core Web API** - Web API framework
-   **Entity Framework Core 9.0** - ORM for data access
-   **SQL Server** - Primary database

### Authentication & Security

-   **JWT Bearer Authentication** - Token-based authentication

### Data Mapping & Validation

-   **Mapster** - Fast object mapping library

### Logging & Monitoring

-   **Serilog** - Structured logging

### External Services & Integrations

-   **Azure Blob Storage** - File storage service
-   **Redis** - Caching and session storage
-   **ImageSharp** - Image processing and optimization
-   **StackExchange.Redis** - Redis client

### Development Tools

-   **Swagger/OpenAPI** - API documentation
-   **Microsoft.AspNetCore.OpenApi** - OpenAPI generation

## 🚀 Hướng dẫn Setup & Development

### Yêu cầu hệ thống

-   .NET 9.0 SDK
-   SQL Server
-   Redis (optional, cho caching)
-   Visual Studio 2022 hoặc VS Code

### Cài đặt ban đầu

1. **Clone repository**

    ```bash
    git clone <repository-url>
    cd ApiStarterKit
    ```

2. **Restore packages**

    ```bash
    dotnet restore
    ```

3. **Cấu hình database**

    - Cập nhật connection string trong `Presentation/Host/appsettings.Development.json`
    - Chạy Entity Framework migrations:

    ```bash
    cd Presentation/Host
    dotnet ef database update
    ```

4. **Cấu hình Azure Blob Storage** (nếu sử dụng)

    - Cập nhật connection string trong `appsettings.Development.json`
    - Tạo container trong Azure Storage Account

5. **Build solution**
    ```bash
    dotnet build
    ```

### Chạy ứng dụng

1. **Chạy API chính**

    ```bash
    cd Presentation/Host
    dotnet run
    ```

2. **Chạy Webhook API** (nếu cần)

    ```bash
    cd Presentation/Webhook
    dotnet run
    ```

3. **Truy cập Swagger UI**
    - Main API: `https://localhost:7001/swagger`
    - Webhook API: `https://localhost:7002/swagger`

## 📁 Mô tả chi tiết các Layer

### 🎯 Core Layer

#### Domain

-   **Entities**: Định nghĩa các domain model chính (User, Role, etc.)
-   **Identity**: Models cho authentication và authorization
-   **IRepositories**: Interface cho data access pattern
-   **ErrorModel**: Custom error handling models

#### Application

-   **Services**: Business logic và application services
-   **Authentication**: JWT token management
-   **Mapping**: Object mapping configurations
-   **DependencyInjection**: Service registration

### 🏗️ Infrastructure Layer

#### Infrastructures

-   **DbContext**: Entity Framework configuration
-   **Repositories**: Implementation của repository pattern
-   **Authentication**: JWT implementation

#### Integrations

-   **AzureBlob**: File upload/download service
-   **Email**: Email sending service
-   **Redis**: Caching service
-   **ImageOptimization**: Image processing service

### 🎨 Presentation Layer

#### Host (Main API)

-   **Controllers**: REST API endpoints
-   **Extensions**: Middleware và configuration extensions
-   **Program.cs**: Application startup configuration

#### Webhook

-   **Controllers**: Webhook endpoints cho external integrations

### 🔧 Shared Layer

-   **DTOs**: Data transfer objects cho API requests/responses
-   **Exceptions**: Custom exception classes
-   **Helpers**: Utility functions và helper classes
-   **Commons**: Shared models và constants

## 🔐 Authentication & Authorization

Dự án sử dụng JWT Bearer authentication:

```json
{
	"JwtSettings": {
		"Key": "your-secret-key",
		"Issuer": "your-issuer",
		"Audience": "your-audience",
		"ExpireDays": 1
	}
}
```

## 📊 Logging

Sử dụng Serilog với cấu hình:

-   Console logging cho development
-   File logging với daily rotation
-   Structured logging format

## 🧪 Testing

### Unit Tests

-   Sử dụng xUnit framework
-   Test business logic trong Application layer
-   Mock external dependencies

### Integration Tests

-   Test API endpoints
-   Test database operations
-   Test external service integrations

## 🚀 Deployment

### Development

```bash
dotnet run --environment Development
```

### Production

```bash
dotnet publish -c Release
dotnet run --environment Production
```

## 📝 Coding Standards

### Naming Conventions

-   **PascalCase**: Classes, Methods, Properties
-   **camelCase**: Variables, Parameters
-   **UPPER_CASE**: Constants

### File Organization

-   Mỗi entity có folder riêng với DTOs, Services, Controllers
-   Shared components trong Shared project
-   Extensions trong Extensions folder

### Error Handling

-   Sử dụng custom exceptions
-   Global exception handler middleware
-   Structured error responses

## SPONSOR: SABO
