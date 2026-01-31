import { useCallback, useMemo } from "react";
import { useCartStore, CartItem } from "@/stores";
import { ProductSize } from "@/models/product";
import { Topping } from "@/models/topping";

interface UseCartReturn {
	// State
	items: CartItem[];
	itemCount: number;
	subtotal: number;
	vatAmount: number;
	discountAmount: number;
	totalAmount: number;
	includeVat: boolean;
	voucherCode: string | null;
	note: string;
	isEmpty: boolean;

	// Actions
	addItem: (item: {
		productId: string;
		productName: string;
		productImageUrl?: string;
		selectedSize: ProductSize;
		selectedToppings: (Topping & { quantity: number })[];
		quantity: number;
		note?: string;
	}) => void;
	updateQuantity: (itemId: string, quantity: number) => void;
	removeItem: (itemId: string) => void;
	clearCart: () => void;
	setIncludeVat: (include: boolean) => void;
	applyVoucher: (code: string, discountAmount: number) => void;
	removeVoucher: () => void;
	setNote: (note: string) => void;
}

export const useCart = (): UseCartReturn => {
	const store = useCartStore();

	const addItem = useCallback(
		(item: Parameters<UseCartReturn["addItem"]>[0]) => {
			const unitPrice =
				item.selectedSize.price +
				item.selectedToppings.reduce((sum, t) => sum + t.price * t.quantity, 0);

			store.addItem({
				...item,
				unitPrice,
			});
		},
		[store],
	);

	const updateQuantity = useCallback(
		(itemId: string, quantity: number) => {
			store.updateItemQuantity(itemId, quantity);
		},
		[store],
	);

	const removeItem = useCallback(
		(itemId: string) => {
			store.removeItem(itemId);
		},
		[store],
	);

	const clearCart = useCallback(() => {
		store.clearCart();
	}, [store]);

	const setIncludeVat = useCallback(
		(include: boolean) => {
			store.setIncludeVat(include);
		},
		[store],
	);

	const applyVoucher = useCallback(
		(code: string, discountAmount: number) => {
			store.setVoucher(code, discountAmount);
		},
		[store],
	);

	const removeVoucher = useCallback(() => {
		store.setVoucher(null, 0);
	}, [store]);

	const setNote = useCallback(
		(note: string) => {
			store.setNote(note);
		},
		[store],
	);

	return {
		// State
		items: store.items,
		itemCount: store.getItemCount(),
		subtotal: store.getSubtotal(),
		vatAmount: store.getVatAmount(),
		discountAmount: store.discountAmount,
		totalAmount: store.getTotalAmount(),
		includeVat: store.includeVat,
		voucherCode: store.voucherCode,
		note: store.note,
		isEmpty: store.items.length === 0,

		// Actions
		addItem,
		updateQuantity,
		removeItem,
		clearCart,
		setIncludeVat,
		applyVoucher,
		removeVoucher,
		setNote,
	};
};

export default useCart;
