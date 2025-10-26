import { NextResponse } from "next/server";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false, // ✅ Important: disable default body parsing
  },
};

export async function POST(request: Request) {
  try {
    // ✅ 1. Read the raw body (required for signature verification)
    const rawBody = await request.text();

    // ✅ 2. Parse the JSON safely
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch {
      console.warn("⚠️ Invalid JSON received from PaymentPoint");
      return NextResponse.json(
        { status: "error", message: "Invalid JSON" },
        { status: 400 }
      );
    }

    console.log("✅ Webhook Received from PaymentPoint:", data);

    // ✅ 3. Verify PaymentPoint Signature
    const signature = request.headers.get("paymentpoint-signature");
    const secret =
      process.env.PAYMENTPOINT_WEBHOOK_SECRET ||
      "b6c78bbe842c103548b6e93360def7a9fee8d89b847e7579ac648206898149e699abec0fc05518faefbc86ce43269dcb90a7e9665895993cfa930fe0"; // Replace with your actual secret (in .env)

    if (!signature) {
      console.warn("⚠️ Missing PaymentPoint signature header");
      return NextResponse.json(
        { status: "error", message: "Missing signature" },
        { status: 400 }
      );
    }

    // Generate the expected signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("❌ Invalid PaymentPoint signature");
      return NextResponse.json(
        { status: "error", message: "Invalid signature" },
        { status: 403 }
      );
    }

    // ✅ 4. Log and confirm notification receipt
    console.log("✅ Verified Webhook Signature from PaymentPoint");

    // ✅ 5. (Optional) Extract payment data for logging/testing
    const {
      notification_status,
      transaction_id,
      amount_paid,
      transaction_status,
      sender,
      receiver,
      description,
      timestamp,
    } = data;

    console.log("💰 Payment Details:");
    console.log("Transaction ID:", transaction_id);
    console.log("Amount Paid:", amount_paid);
    console.log("Receiver:", receiver);
    console.log("Status:", transaction_status || notification_status);
    console.log("Timestamp:", timestamp);

    // ✅ 6. Send success response back to PaymentPoint
    return NextResponse.json(
      { status: "success", message: "Webhook received and verified" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("🔥 Webhook Error:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

// ✅ GET route for testing if webhook is live
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "PaymentPoint Webhook route active 🚀",
  });
}
