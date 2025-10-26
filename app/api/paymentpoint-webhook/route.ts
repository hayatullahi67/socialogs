import { NextResponse } from "next/server";
import crypto from "crypto";

// Replace with your actual secret key from PaymentPoint
const SECURITY_KEY = "xxx"; // 🔐 Use env variable in production

export async function POST(request: Request) {
  try {
    // Get signature from headers
    const signature = request.headers.get("paymentpoint-signature");
    if (!signature) {
      return NextResponse.json({ status: "error", message: "Missing signature" }, { status: 400 });
    }

    // Get the raw request body as text (important for hash verification)
    const rawBody = await request.text();

    // Verify signature (PaymentPoint uses SHA-256 HMAC)
    const calculatedSignature = crypto
      .createHmac("sha256", SECURITY_KEY)
      .update(rawBody)
      .digest("hex");

    if (calculatedSignature !== signature) {
      return NextResponse.json({ status: "error", message: "Invalid signature" }, { status: 400 });
    }

    // Parse the body after verifying signature
    const data = JSON.parse(rawBody);

    // Extract fields from payload
    const {
      transaction_id,
      amount_paid,
      settlement_amount,
      transaction_status,
      customer,
    } = data;

    console.log("✅ Webhook received:");
    console.log(`Transaction ID: ${transaction_id}`);
    console.log(`Amount Paid: ${amount_paid}`);
    console.log(`Settlement Amount: ${settlement_amount}`);
    console.log(`Status: ${transaction_status}`);
    console.log(`Customer: ${customer?.name || "Unknown"}`);

    // TODO: You can store this data in Firestore or your DB here

    // Respond success to acknowledge receipt
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json({ status: "error", message: "Invalid JSON" }, { status: 400 });
  }
}
