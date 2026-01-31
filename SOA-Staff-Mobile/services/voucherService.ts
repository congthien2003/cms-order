import api from "@/lib/api";
import { ApiResponse } from "@/models/common";
import {
	ValidateVoucherRequest,
	ValidateVoucherResponse,
} from "@/models/voucher";

class VoucherService {
	private apiRoute = {
		VALIDATE: "/vouchers/validate",
	};

	/**
	 * Validate a voucher code
	 */
	async validate(
		data: ValidateVoucherRequest,
	): Promise<ApiResponse<ValidateVoucherResponse>> {
		return api.post<ApiResponse<ValidateVoucherResponse>>(
			this.apiRoute.VALIDATE,
			data,
		);
	}

	/**
	 * Quick validate by code and amount
	 */
	async validateCode(
		code: string,
		orderAmount: number,
	): Promise<ApiResponse<ValidateVoucherResponse>> {
		return this.validate({ code, orderAmount });
	}
}

export default new VoucherService();
