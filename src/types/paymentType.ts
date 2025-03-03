export interface IPaymentInitiateRequest {
  return_url: string;
  website_url: string;
  amount: number;
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info: {
    name:string;
  }
  amount_breakdow?: string;
  product_details?: string;
}

export interface IPaymentInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: string;
}

export interface IPaymentLookupResponse {
    pidx: string;
    total_amount: number;
    status: "Completed" | "Pending" | "Failed";
    transaction_id?: string;
    purchase_order_id: string;
    purchase_order_name: string;
  }
