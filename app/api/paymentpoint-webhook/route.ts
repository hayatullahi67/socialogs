


import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";

export const config = {
  api: {
    bodyParser: false, // ❗ Disable automatic JSON parsing for raw signature validation
  },
};

export async function POST(request: Request) {
  try {
    // ✅ 1. Read raw text (PaymentPoint sends JSON)
    const rawBody = await request.text();

    // ✅ 2. Parse JSON safely
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch {
      console.warn("⚠️ Invalid JSON from PaymentPoint");
      return NextResponse.json({ status: "error", message: "Invalid JSON" }, { status: 400 });
    }

    console.log("✅ Webhook data received:", data);

    // ✅ 3. Validate signature
    const signature = request.headers.get("paymentpoint-signature");
    const secret = process.env.PAYMENTPOINT_WEBHOOK_SECRET || "b6c78bbe842c103548b6e93360def7a9fee8d89b847e7579ac648206898149e699abec0fc05518faefbc86ce43269dcb90a7e9665895993cfa930fe0";

    if (!signature) {
      console.warn("⚠️ Missing webhook signature header");
      return NextResponse.json({ status: "error", message: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("❌ Invalid PaymentPoint signature");
      return NextResponse.json({ status: "error", message: "Invalid signature" }, { status: 403 });
    }

    // ✅ 4. Extract payment data (based on PaymentPoint docs)
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

    const account_number = receiver?.account_number;

    if (!account_number) {
      console.warn("⚠️ No receiver.account_number found in webhook payload");
      return NextResponse.json(
        { status: "ignored", reason: "Missing account_number" },
        { status: 200 }
      );
    }

    // ✅ 5. Lookup user in Firestore by virtual account number
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("virtualAccount.accountNumber", "==", account_number));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`⚠️ User not found for account number ${account_number}`);
      return NextResponse.json(
        { status: "error", message: "User not found" },
        { status: 404 }
      );
    }

    const userDoc = snapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);
    const userData = userDoc.data();

    // ✅ 6. Prevent duplicate transactions
    const transactions = userData.transactions || [];
    if (transactions.some((txn: any) => txn.id === transaction_id)) {
      console.log("⚠️ Duplicate transaction ignored:", transaction_id);
      return NextResponse.json({ status: "duplicate" }, { status: 200 });
    }

    // ✅ 7. Update Firestore
    const amountToAdd = amount_paid ?? 0;

    await updateDoc(userRef, {
      transactions: arrayUnion({
        id: transaction_id || `txn_${Date.now()}`,
        status: transaction_status || notification_status || "unknown",
        amount: amount_paid || 0,
        settlement_amount: settlement_amount || 0,
        settlement_fee: settlement_fee || 0,
        sender: sender || {},
        receiver: receiver || {},
        description: description || "No description",
        timestamp: timestamp || new Date().toISOString(),
      }),
      balance: increment(amountToAdd),
      "virtualAccount.lastPayment": amount_paid ?? 0,
      "virtualAccount.updatedAt": new Date().toISOString(),
    });

    console.log(`💰 Updated balance for account ${account_number}`);

    return NextResponse.json({ status: "success", message: "Processed successfully" });
  } catch (err: any) {
    console.error("🔥 Webhook error:", err);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "PaymentPoint webhook active 🚀",
  });
}
