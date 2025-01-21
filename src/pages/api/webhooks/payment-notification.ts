import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const signature = req.headers["x-signature"];
    const timestamp = req.headers["x-timestamp"];
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!verifyWebhookSignature(signature as string, payload, timestamp as string)) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const {
      paymentId,
      transactionId,
      status,
      amount,
      currency,
      responseCode,
      responseText,
      receiptNumber,
      settlementDate,
    } = req.body;

    // Process the payment notification
    // Here you would typically:
    // 1. Update the order status in your database
    // 2. Notify the customer
    // 3. Trigger any necessary business logic

    console.log("Payment notification received:", {
      paymentId,
      status,
      amount,
      currency,
    });

    return res.status(200).json({ message: "Notification processed successfully" });
  } catch (error) {
    console.error("Payment notification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function verifyWebhookSignature(signature: string, payload: string, timestamp: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.WESTPAC_SECRET_KEY!)
      .update(payload + timestamp)
      .digest("base64");

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}
