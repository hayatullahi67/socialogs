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


import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, increment } from "firebase/firestore"

export async function POST(request: Request) {
  try {
    // ✅ Read the body ONCE
    const rawBody = await request.text()
    let data: any = {}

    try {
      data = JSON.parse(rawBody)
    } catch {
      console.warn("⚠️ Webhook body is not valid JSON, using raw text.")
      data = { raw: rawBody }
    }

    console.log("✅ PaymentPoint Webhook Received:", data)

    const {
      account_number,
      amount_paid,
      transaction_id,
      transaction_status,
      payment_reference,
      payment_date,
    } = data

    if (!account_number) {
      console.warn("⚠️ Missing account_number in webhook payload")
      return NextResponse.json(
        { status: "ignored", reason: "No account_number found" },
        { status: 200 }
      )
    }

    // 🔍 Find user by virtual account number
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("virtualAccount.accountNumber", "==", account_number))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.warn(`⚠️ No user found for account number: ${account_number}`)
      return NextResponse.json(
        { status: "error", message: `User not found for account number ${account_number}` },
        { status: 404 }
      )
    }

    const userDoc = snapshot.docs[0]
    const userRef = doc(db, "users", userDoc.id)

    // 💰 Update the user's Firestore document
    await updateDoc(userRef, {
      transactions: arrayUnion({
        id: transaction_id || `txn_${Date.now()}`,
        reference: payment_reference || "no_ref",
        amount: amount_paid || 0,
        status: transaction_status || "unknown",
        date: payment_date || new Date().toISOString(),
      }),
      balance: increment((amount_paid ?? 0) / 100),
      "virtualAccount.lastPayment": amount_paid ?? 0,
      "virtualAccount.updatedAt": new Date().toISOString(),
    })

    console.log(`💰 User with account ${account_number} updated successfully.`)

    return NextResponse.json({
      status: "success",
      message: "Webhook processed successfully 🚀",
    })
  } catch (error: any) {
    console.error("🔥 Webhook error:", error)
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Webhook route is live and ready 🚀",
  })
}
