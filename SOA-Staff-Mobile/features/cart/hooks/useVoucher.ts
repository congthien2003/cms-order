import { useState, useCallback } from "react";
import voucherService from "@/services/voucherService";
import { ValidateVoucherResponse } from "@/models/voucher";

interface UseVoucherReturn {
	isLoading: boolean;
	error: string | null;
	voucherResult: ValidateVoucherResponse | null;
	validateVoucher: (
		code: string,
		orderAmount: number,
	) => Promise<ValidateVoucherResponse | null>;
	clearVoucher: () => void;
}

export const useVoucher = (): UseVoucherReturn => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [voucherResult, setVoucherResult] =
		useState<ValidateVoucherResponse | null>(null);

	const validateVoucher = useCallback(
		async (
			code: string,
			orderAmount: number,
		): Promise<ValidateVoucherResponse | null> => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await voucherService.validateCode(code, orderAmount);

				if (response.isSuccess && response.data) {
					setVoucherResult(response.data);
					if (!response.data.isValid) {
						setError(response.data.message || "Invalid voucher");
					}
					return response.data;
				} else {
					setError(response.message || "Failed to validate voucher");
					return null;
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const clearVoucher = useCallback(() => {
		setVoucherResult(null);
		setError(null);
	}, []);

	return {
		isLoading,
		error,
		voucherResult,
		validateVoucher,
		clearVoucher,
	};
};

export default useVoucher;
