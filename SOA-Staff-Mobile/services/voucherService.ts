import api from "@/lib/api";
import { ApiResponse } from "@/models/common";
import {
  ValidateVoucherRequest,
  ValidateVoucherResponse,
} from "@/models/voucher";

class VoucherService {
  /**
   * API routes matching VouchersController
   * Controller: api/vouchers (non-versioned)
   */
  private apiRoute = {
    BASE: "/vouchers",
    VALIDATE: "/vouchers/validate",
  };

  /**
   * Validate a voucher code for an order
   * API: POST /vouchers/validate (body: { code, orderAmount })
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
