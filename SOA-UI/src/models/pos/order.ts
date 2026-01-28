// Order types
export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Completed'
  | 'Cancelled';

export type PaymentMethod = 'Cash' | 'BankTransfer' | 'Card';
export type PaymentStatus = 'Pending' | 'Unpaid' | 'Paid' | 'Refunded';

export interface OrderItemTopping {
  id: string;
  toppingId: string;
  toppingName: string;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSizeId: string | null;
  sizeName: string | null;
  quantity: number;
  unitPrice: number;
  toppingTotal: number;
  itemTotal: number;
  note: string | null;
  toppings: OrderItemTopping[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerPhone: string | null;
  subTotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  voucherCode: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  itemCount: number;
  createdDate: string;
  createdAt?: string; // Alias
  items?: OrderItem[];
}

export interface OrderDetail extends Order {
  vatPercentage: number;
  isVATIncluded: boolean;
  voucherId: string | null;
  note: string | null;
  modifiedDate: string | null;
  items: OrderItem[];
}

// Order requests
export interface OrderItemToppingRequest {
  toppingId: string;
  quantity: number;
}

export interface OrderItemRequest {
  productId: string;
  productSizeId?: string;
  quantity: number;
  note?: string;
  toppings?: OrderItemToppingRequest[];
}

export interface CreateOrderRequest {
  customerName?: string;
  customerPhone?: string;
  paymentMethod: PaymentMethod;
  voucherCode?: string;
  note?: string;
  items: OrderItemRequest[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  reason?: string;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

export interface CancelOrderRequest {
  reason?: string;
}

// Order list params
export interface GetOrdersParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
}

// Alias for consistency
export type GetOrdersRequest = GetOrdersParams;

// Receipt
export interface ReceiptItem {
  productName: string;
  sizeName: string | null;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  toppings: string[];
}

export interface Receipt {
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  orderNumber: string;
  orderDate: string;
  customerName: string | null;
  customerPhone: string | null;
  items: ReceiptItem[];
  subTotal: number;
  voucherCode: string | null;
  discountAmount: number;
  vatPercentage: number;
  vatAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  receiptFooter: string | null;
}

// Alias for consistency
export type OrderReceipt = Receipt;
