import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // make sure you have this
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";

/**
 * Handles webhook events from PaymentPoint
 * Triggered whenever a payment is made to a virtual account
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("✅ PaymentPoint Webhook Received:", data);

    // Example payload structure from PaymentPoint
    const {
      customer, // contains info like customer_id, name, email
      amount_paid,
      transaction_id,
      transaction_status,
      payment_reference,
      payment_date,
    } = data;

    if (!customer?.customer_id) {
      console.warn("⚠️ Missing customer_id in webhook data:", data);
      return NextResponse.json(
        { status: "ignored", reason: "No customer_id found" },
        { status: 200 }
      );
    }

    // Reference to the user's Firestore document (using their customer_id)
    const userRef = doc(db, "users", customer.customer_id);

    // Update the user's record
    await updateDoc(userRef, {
      transactions: arrayUnion({
        id: transaction_id,
        reference: payment_reference,
        amount: amount_paid,
        status: transaction_status,
        date: payment_date || new Date().toISOString(),
      }),
      balance: increment(amount_paid / 100), // divide by 100 if amount is in kobo
    });

    console.log(`💰 User ${customer.customer_id} balance updated successfully.`);

    return NextResponse.json({ status: "success", message: "Webhook processed" });
  } catch (error: any) {
    console.error("🔥 Webhook error:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET request — used to confirm webhook is live
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Webhook route is live and ready 🚀",
  });
}