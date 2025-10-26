// import { NextResponse } from "next/server";
// import crypto from "crypto";

// // Replace with your actual secret key from PaymentPoint
// const SECURITY_KEY = "xxx"; // 🔐 Use env variable in production

// export async function POST(request: Request) {
//   try {
//     // Get signature from headers
//     const signature = request.headers.get("paymentpoint-signature");
//     if (!signature) {
//       return NextResponse.json({ status: "error", message: "Missing signature" }, { status: 400 });
//     }

//     // Get the raw request body as text (important for hash verification)
//     const rawBody = await request.text();

//     // Verify signature (PaymentPoint uses SHA-256 HMAC)
//     const calculatedSignature = crypto
//       .createHmac("sha256", SECURITY_KEY)
//       .update(rawBody)
//       .digest("hex");

//     if (calculatedSignature !== signature) {
//       return NextResponse.json({ status: "error", message: "Invalid signature" }, { status: 400 });
//     }

//     // Parse the body after verifying signature
//     const data = JSON.parse(rawBody);

//     // Extract fields from payload
//     const {
//       transaction_id,
//       amount_paid,
//       settlement_amount,
//       transaction_status,
//       customer,
//     } = data;

//     console.log("✅ Webhook received:");
//     console.log(`Transaction ID: ${transaction_id}`);
//     console.log(`Amount Paid: ${amount_paid}`);
//     console.log(`Settlement Amount: ${settlement_amount}`);
//     console.log(`Status: ${transaction_status}`);
//     console.log(`Customer: ${customer?.name || "Unknown"}`);

//     // TODO: You can store this data in Firestore or your DB here

//     // Respond success to acknowledge receipt
//     return NextResponse.json({ status: "success" }, { status: 200 });
//   } catch (error) {
//     console.error("❌ Webhook Error:", error);
//     return NextResponse.json({ status: "error", message: "Invalid JSON" }, { status: 400 });
//   }

// }






import { NextResponse } from "next/server";
import crypto from "crypto";

// 🚀 PaymentPoint Webhook Route
export async function POST(request: Request) {
  try {
    // Read the raw body as text
    const rawBody = await request.text();

    // Parse JSON safely
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (err) {
      console.error("❌ Invalid JSON received:", err);
      return NextResponse.json({ status: "error", message: "Invalid JSON" }, { status: 400 });
    }

    // Get the PaymentPoint-Signature from headers
    const signature = request.headers.get("paymentpoint-signature");
    if (!signature) {
      console.warn("⚠️ Missing PaymentPoint-Signature header");
      return NextResponse.json({ status: "error", message: "Missing signature" }, { status: 400 });
    }

    // Your PaymentPoint secret security key (from dashboard)
    const securityKey =
      process.env.PAYMENTPOINT_WEBHOOK_SECRET ||
      "b6c78bbe842c103548b6e93360def7a9fee8d89b847e7579ac648206898149e699abec0fc05518faefbc86ce43269dcb90a7e9665895993cfa930fe0"; // example key

    // Recreate the hash using raw body and your secret key
    const calculatedSignature = crypto
      .createHmac("sha256", securityKey)
      .update(rawBody)
      .digest("hex");

    // Compare signatures
    if (calculatedSignature !== signature) {
      console.error("❌ Invalid signature from PaymentPoint");
      return NextResponse.json({ status: "error", message: "Invalid signature" }, { status: 403 });
    }

    // ✅ Signature valid — process payment data
    const {
      notification_status,
      transaction_id,
      amount_paid,
      settlement_amount,
      settlement_fee,
      transaction_status,
      sender,
      receiver,
      description,
      timestamp,
    } = data;

    console.log("✅ PaymentPoint Webhook Received:");
    console.log("Transaction ID:", transaction_id);
    console.log("Amount Paid:", amount_paid);
    console.log("Settlement Amount:", settlement_amount);
    console.log("Status:", transaction_status);
    console.log("Receiver:", receiver?.account_number);
    console.log("Timestamp:", timestamp);

    // (Later: Update DB here, credit user wallet, etc.)

    return NextResponse.json({ status: "success", message: "Webhook processed" }, { status: 200 });
  } catch (err: any) {
    console.error("🔥 Webhook error:", err);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "PaymentPoint webhook is active 🚀",
  });
}
