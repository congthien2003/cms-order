// Category types
export interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  productsCount?: number; // Alias
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  isActive?: boolean;
}

// Product types
export interface ProductSize {
  id: string;
  sizeName: string;
  priceAdjustment: number;
  isDefault: boolean;
  isActive: boolean;
}

export interface ProductTopping {
  id: string;
  toppingId: string;
  toppingName: string;
  price: number;
  isDefault: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  basePrice: number;
  isActive: boolean;
  sortOrder: number;
  sizes: ProductSize[];
  toppings: ProductTopping[];
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateProductRequest {
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  basePrice: number;
  sortOrder?: number;
  sizes?: {
    sizeName: string;
    priceAdjustment: number;
    isDefault?: boolean;
  }[];
}

export interface UpdateProductRequest extends CreateProductRequest {
  isActive?: boolean;
}

// Topping types
export interface Topping {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateToppingRequest {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateToppingRequest extends CreateToppingRequest {
  isActive?: boolean;
}

// Voucher types
export type DiscountType = 'Percentage' | 'FixedAmount';

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number | null;
  minimumOrderAmount?: number | null; // Alias
  maxDiscountAmount: number | null;
  maximumDiscount?: number | null; // Alias
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  isValid?: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateVoucherRequest {
  code: string;
  name?: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  minimumOrderAmount?: number;
  maxDiscountAmount?: number;
  maximumDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
}

export interface UpdateVoucherRequest {
  code?: string;
  name?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minOrderAmount?: number;
  minimumOrderAmount?: number;
  maxDiscountAmount?: number;
  maximumDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  isActive?: boolean;
}

export interface ValidateVoucherRequest {
  code: string;
  orderAmount: number;
}

export interface ValidateVoucherResponse {
  isValid: boolean;
  voucher?: Voucher;
  discountAmount?: number;
  errorMessage?: string;
}
