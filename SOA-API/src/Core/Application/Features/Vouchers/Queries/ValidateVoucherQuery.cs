using MapsterMapper;
using MediatR;
using Application.Exceptions;
using Application.Features.Vouchers.Models;
using Application.Models.Common;
using Domain.Entities.Enums;
using Domain.Repositories;

namespace Application.Features.Vouchers.Queries;

public record ValidateVoucherQuery(string Code, decimal OrderAmount) : IRequest<Result<VoucherValidationResponse>>;

public class ValidateVoucherQueryHandler : IRequestHandler<ValidateVoucherQuery, Result<VoucherValidationResponse>>
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public ValidateVoucherQueryHandler(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Result<VoucherValidationResponse>> Handle(ValidateVoucherQuery request, CancellationToken cancellationToken)
    {
        var vouchers = await _repositoryManager.Voucher.FindByConditionAsync(
            v => v.Code.ToLower() == request.Code.ToLower(),
            trackChanges: false,
            cancellationToken
        );

        var voucher = vouchers.FirstOrDefault();

        if (voucher == null)
        {
            return Result<VoucherValidationResponse>.Success(null, new VoucherValidationResponse
            {
                IsValid = false,
                Message = "Voucher code not found",
                DiscountAmount = 0,
                FinalAmount = request.OrderAmount
            });
        }

        // Check if voucher is active
        if (!voucher.IsActive)
        {
            return Result<VoucherValidationResponse>.Success(null, new VoucherValidationResponse
            {
                IsValid = false,
                Message = "Voucher is not active",
                Voucher = _mapper.Map<VoucherResponse>(voucher),
                DiscountAmount = 0,
                FinalAmount = request.OrderAmount
            });
        }

        // Check date range
        var now = DateTime.UtcNow;
        if (now < voucher.StartDate)
        {
            return Result<VoucherValidationResponse>.Success(null, new VoucherValidationResponse
            {
                IsValid = false,
                Message = $"Voucher is not yet valid. Valid from {voucher.StartDate:yyyy-MM-dd}",
                Voucher = _mapper.Map<VoucherResponse>(voucher),
                DiscountAmount = 0,
                FinalAmount = request.OrderAmount
            });
        }

        if (now > voucher.EndDate)
        {
            return Result<VoucherValidationResponse>.Success(null, new VoucherValidationResponse
            {
                IsValid = false,
                Message = $"Voucher has expired on {voucher.EndDate:yyyy-MM-dd}",
                Voucher = _mapper.Map<VoucherResponse>(voucher),
                DiscountAmount = 0,
                FinalAmount = request.OrderAmount
            });
        }

        // Check usage limit
        if (voucher.UsageLimit.HasValue && voucher.UsedCount >= voucher.UsageLimit.Value)
        {
            return Result<VoucherValidationResponse>.Success(null, new VoucherValidationResponse
            {
                IsValid = false,
                Message = "Voucher usage limit has been reached",
                Voucher = _mapper.Map<VoucherResponse>(voucher),
                DiscountAmount = 0,
                FinalAmount = request.OrderAmount
            });
        }

        // Check minimum order amount
        if (voucher.MinOrderAmount.HasValue && request.OrderAmount < voucher.MinOrderAmount.Value)
        {
            return Result<VoucherValidationResponse>.Success(null, new VoucherValidationResponse
            {
                IsValid = false,
                Message = $"Order amount must be at least {voucher.MinOrderAmount.Value:N0} to use this voucher",
                Voucher = _mapper.Map<VoucherResponse>(voucher),
                DiscountAmount = 0,
                FinalAmount = request.OrderAmount
            });
        }

        // Calculate discount
        decimal discountAmount = 0;
        if (voucher.DiscountType == DiscountType.Percentage)
        {
            discountAmount = request.OrderAmount * (voucher.DiscountValue / 100);
            
            // Apply max discount cap if set
            if (voucher.MaxDiscountAmount.HasValue && discountAmount > voucher.MaxDiscountAmount.Value)
            {
                discountAmount = voucher.MaxDiscountAmount.Value;
            }
        }
        else // FixedAmount
        {
            discountAmount = voucher.DiscountValue;
            
            // Discount cannot exceed order amount
            if (discountAmount > request.OrderAmount)
            {
                discountAmount = request.OrderAmount;
            }
        }

        var finalAmount = request.OrderAmount - discountAmount;

        return Result<VoucherValidationResponse>.Success(null, new VoucherValidationResponse
        {
            IsValid = true,
            Message = "Voucher is valid",
            Voucher = _mapper.Map<VoucherResponse>(voucher),
            DiscountAmount = discountAmount,
            FinalAmount = finalAmount
        });
    }
}
