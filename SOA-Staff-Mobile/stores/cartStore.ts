import { create } from "zustand";
import { ProductSize } from "@/models/product";
import { Topping } from "@/models/topping";

/**
 * Cart item with selected size and toppings
 */
export interface CartItem {
	id: string; // unique cart item id
	productId: string;
	productName: string;
	productImageUrl?: string;
	selectedSize: ProductSize;
	selectedToppings: (Topping & { quantity: number })[];
	quantity: number;
	note?: string;
	unitPrice: number; // size price + toppings total
	subtotal: number;
}

interface CartState {
	items: CartItem[];
	includeVat: boolean;
	vatRate: number;
	voucherCode: string | null;
	discountAmount: number;
	note: string;

	// Actions
	addItem: (item: Omit<CartItem, "id" | "subtotal">) => void;
	updateItem: (id: string, updates: Partial<CartItem>) => void;
	updateItemQuantity: (id: string, quantity: number) => void;
	removeItem: (id: string) => void;
	clearCart: () => void;
	setIncludeVat: (include: boolean) => void;
	setVoucher: (code: string | null, discountAmount: number) => void;
	setNote: (note: string) => void;

	// Computed
	getSubtotal: () => number;
	getVatAmount: () => number;
	getTotalAmount: () => number;
	getItemCount: () => number;
}

const generateCartItemId = () =>
	`cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const calculateItemSubtotal = (item: Omit<CartItem, "subtotal">): number => {
	const toppingsTotal = item.selectedToppings.reduce(
		(sum, t) => sum + t.price * t.quantity,
		0,
	);
	const unitPrice = item.selectedSize.price + toppingsTotal;
	return unitPrice * item.quantity;
};

export const useCartStore = create<CartState>((set, get) => ({
	items: [],
	includeVat: true,
	vatRate: 0.1, // 10% VAT
	voucherCode: null,
	discountAmount: 0,
	note: "",

	addItem: (item) => {
		const subtotal = calculateItemSubtotal({ ...item, id: "" });
		const newItem: CartItem = {
			...item,
			id: generateCartItemId(),
			subtotal,
			unitPrice:
				item.selectedSize.price +
				item.selectedToppings.reduce((sum, t) => sum + t.price * t.quantity, 0),
		};

		set((state) => ({
			items: [...state.items, newItem],
		}));
	},

	updateItem: (id, updates) => {
		set((state) => ({
			items: state.items.map((item) => {
				if (item.id === id) {
					const updatedItem = { ...item, ...updates };
					updatedItem.subtotal = calculateItemSubtotal(updatedItem);
					return updatedItem;
				}
				return item;
			}),
		}));
	},

	updateItemQuantity: (id, quantity) => {
		if (quantity <= 0) {
			get().removeItem(id);
			return;
		}

		set((state) => ({
			items: state.items.map((item) => {
				if (item.id === id) {
					const updatedItem = { ...item, quantity };
					updatedItem.subtotal = updatedItem.unitPrice * quantity;
					return updatedItem;
				}
				return item;
			}),
		}));
	},

	removeItem: (id) => {
		set((state) => ({
			items: state.items.filter((item) => item.id !== id),
		}));
	},

	clearCart: () => {
		set({
			items: [],
			voucherCode: null,
			discountAmount: 0,
			note: "",
		});
	},

	setIncludeVat: (include) => {
		set({ includeVat: include });
	},

	setVoucher: (code, discountAmount) => {
		set({ voucherCode: code, discountAmount });
	},

	setNote: (note) => {
		set({ note });
	},

	getSubtotal: () => {
		return get().items.reduce((sum, item) => sum + item.subtotal, 0);
	},

	getVatAmount: () => {
		const state = get();
		if (!state.includeVat) return 0;
		const subtotal = state.getSubtotal();
		return subtotal * state.vatRate;
	},

	getTotalAmount: () => {
		const state = get();
		const subtotal = state.getSubtotal();
		const vatAmount = state.getVatAmount();
		return subtotal + vatAmount - state.discountAmount;
	},

	getItemCount: () => {
		return get().items.reduce((count, item) => count + item.quantity, 0);
	},
}));

export default useCartStore;
