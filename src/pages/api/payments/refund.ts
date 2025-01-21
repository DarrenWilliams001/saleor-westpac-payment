import { createProtectedHandler } from "@saleor/app-sdk/handlers/next";
import { NextApiRequest, NextApiResponse } from "next";
import { saleorApp } from "../../../saleor-app";
import WestpacPaymentService from "../../../services/westpacPaymentService";
import { RefundRequest, WestpacConfig } from "../../../types/westpac";

export default createProtectedHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { transactionId, amount, reason, customerEmail } = req.body;

    if (!transactionId || !amount) {
      return res.status(400).json({
        error: "Transaction ID and amount are required",
      });
    }

    const westpacConfig: WestpacConfig = {
      apiKey: process.env.WESTPAC_API_KEY!,
      secretKey: process.env.WESTPAC_SECRET_KEY!,
      merchantId: process.env.WESTPAC_MERCHANT_ID!,
      environment: process.env.NODE_ENV === "production" ? "live" : "test",
    };

    const paymentService = new WestpacPaymentService(westpacConfig);

    const refundRequest: RefundRequest = {
      transactionId,
      amount,
      reason,
      customerEmail,
    };

    const refundResponse = await paymentService.processRefund(refundRequest);

    if (refundResponse.responseCode === "ERROR") {
      return res.status(400).json({
        error: refundResponse.responseText || "Refund processing failed",
      });
    }

    return res.status(200).json(refundResponse);
  } catch (error) {
    console.error("Refund processing error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}, saleorApp.apl);
