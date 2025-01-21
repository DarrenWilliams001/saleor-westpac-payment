import { createProtectedHandler } from "@saleor/app-sdk/handlers/next";
import { NextApiRequest, NextApiResponse } from "next";
import { saleorApp } from "../../../saleor-app";
import WestpacPaymentService from "../../../services/westpacPaymentService";
import { PaymentRequest, PaymentStatus, WestpacConfig } from "../../../types/westpac";

export default createProtectedHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      orderNumber,
      transactionType,
      principalAmount,
      currency,
      customerEmail,
      customerIpAddress,
      orderDetails,
      paymentMethod,
      redirectUrl,
      merchantData,
    } = req.body;

    const westpacConfig: WestpacConfig = {
      apiKey: process.env.WESTPAC_API_KEY!,
      secretKey: process.env.WESTPAC_SECRET_KEY!,
      merchantId: process.env.WESTPAC_MERCHANT_ID!,
      environment: process.env.NODE_ENV === "production" ? "live" : "test",
    };

    const paymentService = new WestpacPaymentService(westpacConfig);

    const paymentRequest: PaymentRequest = {
      orderNumber,
      transactionType,
      principalAmount,
      currency,
      customerEmail,
      customerIpAddress,
      orderDetails,
      paymentMethod,
      redirectUrl,
      merchantData,
    };

    const paymentResponse = await paymentService.initiatePayment(paymentRequest);

    if (paymentResponse.status === PaymentStatus.ERROR) {
      return res.status(400).json({
        error: paymentResponse.responseText || "Payment processing failed",
      });
    }

    return res.status(200).json(paymentResponse);
  } catch (error) {
    console.error("Payment processing error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}, saleorApp.apl);
