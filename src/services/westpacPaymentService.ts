import * as crypto from "crypto";
import {
  PaymentConfirmation,
  PaymentRequest,
  PaymentResponse,
  PaymentStatus,
  RefundRequest,
  RefundResponse,
  WestpacConfig,
} from "../types/westpac";

class WestpacPaymentService {
  private config: WestpacConfig;
  private baseUrl: string;

  constructor(config: WestpacConfig) {
    this.config = config;
    this.baseUrl =
      config.environment === "live"
        ? "https://api.payway.com.au/rest/v1"
        : "https://api.uat.payway.com.au/rest/v1";
  }

  private generateHmacSignature(payload: string): string {
    const hmac = crypto.createHmac("sha256", this.config.secretKey);
    hmac.update(payload);
    return hmac.digest("base64");
  }

  private async makeRequest<T>(endpoint: string, method: string, body?: any): Promise<T> {
    const timestamp = new Date().toISOString();
    const payload = body ? JSON.stringify(body) : "";
    const signature = this.generateHmacSignature(payload + timestamp);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
        "X-API-Key": this.config.merchantId,
        "X-Timestamp": timestamp,
        "X-Signature": signature,
      },
      body: payload || undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.responseText || "Payment request failed");
    }

    return response.json();
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Sanitize the request to remove any sensitive data from logs
      const sanitizedRequest = {
        ...request,
        paymentMethod: {
          ...request.paymentMethod,
          card: request.paymentMethod.card
            ? {
                ...request.paymentMethod.card,
                number: "****",
                securityCode: "***",
              }
            : undefined,
        },
      };
      console.log("Initiating payment:", sanitizedRequest);

      const response = await this.makeRequest<PaymentResponse>("/payments", "POST", request);

      // Log sanitized response
      const sanitizedResponse = {
        ...response,
        transactionId: response.transactionId
          ? `****${response.transactionId.slice(-4)}`
          : undefined,
      };
      console.log("Payment response:", sanitizedResponse);

      return response;
    } catch (error) {
      console.error(
        "Payment initiation error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return {
        paymentId: "",
        status: PaymentStatus.ERROR,
        responseCode: "ERROR",
        responseText: error instanceof Error ? error.message : "Payment initiation failed",
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentConfirmation> {
    return this.makeRequest<PaymentConfirmation>(`/payments/${paymentId}`, "GET");
  }

  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const payload = {
        transactionId: request.transactionId,
        amount: request.amount,
        reason: request.reason,
        customerEmail: request.customerEmail,
      };

      const response = await this.makeRequest<RefundResponse>("/refunds", "POST", payload);

      // Log sanitized response
      const sanitizedResponse = {
        ...response,
        transactionId: `****${response.transactionId.slice(-4)}`,
      };
      console.log("Refund response:", sanitizedResponse);

      return response;
    } catch (error) {
      console.error(
        "Refund processing error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return {
        refundId: "",
        status: PaymentStatus.ERROR,
        amount: request.amount,
        transactionId: request.transactionId,
        responseCode: "ERROR",
        responseText: error instanceof Error ? error.message : "Refund processing failed",
      };
    }
  }

  async validateCard(cardDetails: {
    number: string;
    expiryMonth: string;
    expiryYear: string;
  }): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ valid: boolean }>(
        "/cards/validate",
        "POST",
        cardDetails
      );
      return response.valid;
    } catch (error) {
      console.error(
        "Card validation error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return false;
    }
  }
}

export default WestpacPaymentService;
