export interface ApiError {
  readonly isApiError: boolean;
  key: ApiErrorKey;
  message: string;
}

type ApiErrorKey =
  | "user/email_exists"
  | "user/user_does_not_exist"
  | "discount/missing_discount"
  | "discount/discount_inactive"
  | "discount/discount_greater_than_tour_price"
  | "discount/discount_does_not_exist_in_operator_or_tour"
  | "discount/discount_expired"
  | "discount/coupon_incorrect"
  | "stripe/other_event";

export default class ApiError412 extends Error {
  apiError: ApiError;

  constructor({ key, message }: Pick<ApiError, "key" | "message">) {
    super();
    this.name = "API 412";
    this.message = message;
    this.apiError = { isApiError: true, key, message };
  }
}
