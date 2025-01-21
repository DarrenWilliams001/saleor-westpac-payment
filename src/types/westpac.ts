export interface WestpacConfig {
  merchantId: string;
  apiKey: string;
  secretKey: string;
  environment: "test" | "live";
}

export interface PaymentRequest {
  orderNumber: string;
  transactionType: "payment" | "preauth";
  principalAmount: number;
  currency: string;
  customerNumber?: string;
  customerEmail?: string;
  customerIpAddress?: string;
  orderDetails?: OrderDetails;
  paymentMethod: PaymentMethod;
  redirectUrl: string;
  merchantData?: string;
}

export interface OrderDetails {
  orderItems?: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  description?: string;
}

export interface Address {
  firstName?: string;
  lastName?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  email?: string;
}

export interface PaymentMethod {
  type: "creditCard" | "paypal";
  card?: CreditCardDetails;
}

export interface CreditCardDetails {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  securityCode: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: PaymentStatus;
  transactionId?: string;
  receiptNumber?: string;
  responseCode?: string;
  responseText?: string;
  settlementDate?: string;
  redirectUrl?: string;
}

export enum PaymentStatus {
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
  PENDING = "PENDING",
  ERROR = "ERROR",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export interface RefundRequest {
  transactionId: string;
  amount: number;
  reason?: string;
  customerEmail?: string;
}

export interface RefundResponse {
  refundId: string;
  status: PaymentStatus;
  amount: number;
  transactionId: string;
  responseCode?: string;
  responseText?: string;
  receiptNumber?: string;
}

export interface PaymentConfirmation {
  paymentId: string;
  status: PaymentStatus;
  transactionId: string;
  amount: number;
  currency: string;
  responseCode: string;
  responseText: string;
  receiptNumber?: string;
  settlementDate?: string;
  timestamp: string;
}
