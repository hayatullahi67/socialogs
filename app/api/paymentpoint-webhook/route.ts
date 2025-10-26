// import { NextResponse } from "next/server";
// import { db } from "@/lib/firebase"; // make sure you have this
// import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";

// /**
//  * Handles webhook events from PaymentPoint
//  * Triggered whenever a payment is made to a virtual account
//  */
// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     console.log("✅ PaymentPoint Webhook Received:", data);

//     // Example payload structure from PaymentPoint
//     const {
//       customer, // contains info like customer_id, name, email
//       amount_paid,
//       transaction_id,
//       transaction_status,
//       payment_reference,
//       payment_date,
//     } = data;

//     if (!customer?.customer_id) {
//       console.warn("⚠️ Missing customer_id in webhook data:", data);
//       return NextResponse.json(
//         { status: "ignored", reason: "No customer_id found" },
//         { status: 200 }
//       );
//     }

//     // Reference to the user's Firestore document (using their customer_id)
//     const userRef = doc(db, "users", customer.customer_id);

//     // Update the user's record
//     await updateDoc(userRef, {
//       transactions: arrayUnion({
//         id: transaction_id,
//         reference: payment_reference,
//         amount: amount_paid,
//         status: transaction_status,
//         date: payment_date || new Date().toISOString(),
//       }),
//       balance: increment(amount_paid / 100), // divide by 100 if amount is in kobo
//     });

//     console.log(`💰 User ${customer.customer_id} balance updated successfully.`);

//     return NextResponse.json({ status: "success", message: "Webhook processed" });
//   } catch (error: any) {
//     console.error("🔥 Webhook error:", error);
//     return NextResponse.json(
//       { status: "error", message: error.message },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * GET request — used to confirm webhook is live
//  */
// export async function GET() {
//   return NextResponse.json({
//     status: "ok",
//     message: "Webhook route is live and ready 🚀",
//   });
// }



// import { NextResponse } from "next/server";
// import { db } from "@/lib/firebase";
// import { collection, query, where, getDocs, updateDoc, arrayUnion, increment } from "firebase/firestore";

// /**
//  * Webhook handler for PaymentPoint notifications
//  * Finds the user by virtualAccount.accountNumber
//  */
// export async function POST(request: Request) {
//   try {
//     const data = await request.json();
//     console.log("✅ PaymentPoint Webhook Received:", data);

//     // Extract key fields — adjust names to match actual PaymentPoint payload
//     const {
//       account_number,
//       amount_paid,
//       transaction_id,
//       transaction_status,
//       payment_reference,
//       payment_date,
//     } = data;

//     if (!account_number) {
//       console.warn("⚠️ Missing account_number in webhook data:", data);
//       return NextResponse.json(
//         { status: "ignored", reason: "No account_number found" },
//         { status: 200 }
//       );
//     }

//     // 🔍 Query the users collection for the document with this virtualAccount.accountNumber
//     const usersRef = collection(db, "users");
//     const q = query(usersRef, where("virtualAccount.accountNumber", "==", account_number));
//     const querySnapshot = await getDocs(q);

//     if (querySnapshot.empty) {
//       console.warn("⚠️ No user found for account number:", account_number);
//       return NextResponse.json(
//         { status: "error", message: `User not found for account number: ${account_number}` },
//         { status: 404 }
//       );
//     }

//     const userDoc = querySnapshot.docs[0].ref;

//     // ✅ Update user's document with the transaction
//     await updateDoc(userDoc, {
//       transactions: arrayUnion({
//         id: transaction_id,
//         reference: payment_reference,
//         amount: amount_paid,
//         status: transaction_status,
//         date: payment_date || new Date().toISOString(),
//       }),
//       balance: increment(amount_paid / 100), // divide by 100 if amount is in kobo
//       updatedAt: new Date().toISOString(),
//     });

//     console.log(`💰 User with account ${account_number} updated successfully.`);

//     return NextResponse.json({
//       status: "success",
//       message: "Webhook processed successfully",
//     });
//   } catch (error: any) {
//     console.error("🔥 Webhook error:", error);
//     return NextResponse.json(
//       { status: "error", message: error.message },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * GET request — used to confirm webhook route is live
//  */
// export async function GET() {
//   return NextResponse.json({
//     status: "ok",
//     message: "PaymentPoint Webhook route is live and ready 🚀",
//   });
// }


// import { NextResponse } from "next/server"
// import { db } from "@/lib/firebase"
// import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, increment } from "firebase/firestore"

// export async function POST(request: Request) {
//   try {
//     // ✅ Read the body ONCE
//     const rawBody = await request.text()
//     let data: any = {}

//     try {
//       data = JSON.parse(rawBody)
//     } catch {
//       console.warn("⚠️ Webhook body is not valid JSON, using raw text.")
//       data = { raw: rawBody }
//     }

//     console.log("✅ PaymentPoint Webhook Received:", data)

//     const {
//       account_number,
//       amount_paid,
//       transaction_id,
//       transaction_status,
//       payment_reference,
//       payment_date,
//     } = data

//     if (!account_number) {
//       console.warn("⚠️ Missing account_number in webhook payload")
//       return NextResponse.json(
//         { status: "ignored", reason: "No account_number found" },
//         { status: 200 }
//       )
//     }

//     // 🔍 Find user by virtual account number
//     const usersRef = collection(db, "users")
//     const q = query(usersRef, where("virtualAccount.accountNumber", "==", account_number))
//     const snapshot = await getDocs(q)

//     if (snapshot.empty) {
//       console.warn(`⚠️ No user found for account number: ${account_number}`)
//       return NextResponse.json(
//         { status: "error", message: `User not found for account number ${account_number}` },
//         { status: 404 }
//       )
//     }

//     const userDoc = snapshot.docs[0]
//     const userRef = doc(db, "users", userDoc.id)

//     // 💰 Update the user's Firestore document
//     await updateDoc(userRef, {
//       transactions: arrayUnion({
//         id: transaction_id || `txn_${Date.now()}`,
//         reference: payment_reference || "no_ref",
//         amount: amount_paid || 0,
//         status: transaction_status || "unknown",
//         date: payment_date || new Date().toISOString(),
//       }),
//       balance: increment((amount_paid ?? 0) / 100),
//       "virtualAccount.lastPayment": amount_paid ?? 0,
//       "virtualAccount.updatedAt": new Date().toISOString(),
//     })

//     console.log(`💰 User with account ${account_number} updated successfully.`)

//     return NextResponse.json({
//       status: "success",
//       message: "Webhook processed successfully 🚀",
//     })
//   } catch (error: any) {
//     console.error("🔥 Webhook error:", error)
//     return NextResponse.json(
//       { status: "error", message: error.message },
//       { status: 500 }
//     )
//   }
// }

// export async function GET() {
//   return NextResponse.json({
//     status: "ok",
//     message: "Webhook route is live and ready 🚀",
//   })
// }



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

export async function POST(request: Request) {
  try {
    // ✅ 1. Read raw body (needed for signature validation)
    const rawBody = await request.text();
    let data: any = {};

    try {
      data = JSON.parse(rawBody);
    } catch {
      console.warn("⚠️ Invalid JSON received from PaymentPoint");
      return NextResponse.json({ status: "error", message: "Invalid JSON" }, { status: 400 });
    }

    console.log("✅ PaymentPoint Webhook Received:", data);

    // ✅ 2. Verify signature from PaymentPoint
    const signature = request.headers.get("Paymentpoint-Signature"); // <-- Correct header name per docs
    const secret = "b6c78bbe842c103548b6e93360def7a9fee8d89b847e7579ac648206898149e699abec0fc05518faefbc86ce43269dcb90a7e9665895993cfa930fe0"; // 🔐 Keep secret in env variable

    if (signature && secret) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.warn("❌ Invalid PaymentPoint signature.");
        return NextResponse.json(
          { status: "error", message: "Invalid signature" },
          { status: 403 }
        );
      }
    } else {
      console.warn("⚠️ Missing Paymentpoint-Signature or secret key.");
    }

    // ✅ 3. Extract PaymentPoint payload (based on official docs)
    const {
      notification_status,
      transaction_id,
      amount_paid,
      settlement_amount,
      settlement_fee,
      transaction_status,
      sender,
      receiver,
      customer,
      description,
      timestamp,
    } = data;

    // ✅ Ensure receiver.account_number exists (this is your virtual account)
    const account_number = receiver?.account_number;

    if (!account_number) {
      console.warn("⚠️ No receiver.account_number in webhook payload");
      return NextResponse.json(
        { status: "ignored", reason: "Missing account_number" },
        { status: 200 }
      );
    }

    // ✅ 4. Find user by virtual account number in Firestore
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("virtualAccount.accountNumber", "==", account_number));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`⚠️ No user found for account number: ${account_number}`);
      return NextResponse.json(
        { status: "error", message: `User not found for account number ${account_number}` },
        { status: 404 }
      );
    }

    const userDoc = snapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);
    const userData = userDoc.data();

    // ✅ 5. Prevent duplicate credit (idempotency)
    const existingTxns = userData.transactions || [];
    const alreadyProcessed = existingTxns.some(
      (txn: any) => txn.id === transaction_id
    );

    if (alreadyProcessed) {
      console.log("⚠️ Duplicate transaction ignored:", transaction_id);
      return NextResponse.json(
        { status: "duplicate", message: "Transaction already processed" },
        { status: 200 }
      );
    }

    // ✅ 6. Determine correct amount (PaymentPoint uses Naira, not Kobo)
    const amountToAdd = amount_paid ?? 0; // No /100 since docs show amounts in Naira

    // ✅ 7. Update Firestore
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

    console.log(`💰 User with account ${account_number} updated successfully.`);

    return NextResponse.json({
      status: "success",
      message: "Webhook processed successfully 🚀",
    });
  } catch (error: any) {
    console.error("🔥 Webhook error:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "PaymentPoint Webhook route active 🚀",
  });
}
