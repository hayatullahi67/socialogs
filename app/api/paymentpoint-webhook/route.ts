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






// import { NextResponse } from "next/server";
// import crypto from "crypto";

// // 🚀 PaymentPoint Webhook Route
// export async function POST(request: Request) {
//   try {
//     // Read the raw body as text
//     const rawBody = await request.text();

//     // Parse JSON safely
//     let data;
//     try {
//       data = JSON.parse(rawBody);
//     } catch (err) {
//       console.error("❌ Invalid JSON received:", err);
//       return NextResponse.json({ status: "error", message: "Invalid JSON" }, { status: 400 });
//     }

//     // Get the PaymentPoint-Signature from headers
//     const signature = request.headers.get("paymentpoint-signature");
//     if (!signature) {
//       console.warn("⚠️ Missing PaymentPoint-Signature header");
//       return NextResponse.json({ status: "error", message: "Missing signature" }, { status: 400 });
//     }

//     // Your PaymentPoint secret security key (from dashboard)
//     const securityKey =
//       process.env.PAYMENTPOINT_WEBHOOK_SECRET ||
//       "b6c78bbe842c103548b6e93360def7a9fee8d89b847e7579ac648206898149e699abec0fc05518faefbc86ce43269dcb90a7e9665895993cfa930fe0"; // example key

//     // Recreate the hash using raw body and your secret key
//     const calculatedSignature = crypto
//       .createHmac("sha256", securityKey)
//       .update(rawBody)
//       .digest("hex");

//     // Compare signatures
//     if (calculatedSignature !== signature) {
//       console.error("❌ Invalid signature from PaymentPoint");
//       return NextResponse.json({ status: "error", message: "Invalid signature" }, { status: 403 });
//     }

//     // ✅ Signature valid — process payment data
//     const {
//       notification_status,
//       transaction_id,
//       amount_paid,
//       settlement_amount,
//       settlement_fee,
//       transaction_status,
//       sender,
//       receiver,
//       description,
//       timestamp,
//     } = data;

//     console.log("✅ PaymentPoint Webhook Received:");
//     console.log("Transaction ID:", transaction_id);
//     console.log("Amount Paid:", amount_paid);
//     console.log("Settlement Amount:", settlement_amount);
//     console.log("Status:", transaction_status);
//     console.log("Receiver:", receiver?.account_number);
//     console.log("Timestamp:", timestamp);

//     // (Later: Update DB here, credit user wallet, etc.)

//     return NextResponse.json({ status: "success", message: "Webhook processed" }, { status: 200 });
//   } catch (err: any) {
//     console.error("🔥 Webhook error:", err);
//     return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
//   }
// }

// export async function GET() {
//   return NextResponse.json({
//     status: "ok",
//     message: "PaymentPoint webhook is active 🚀",
//   });
// }





// import { NextResponse } from "next/server";
// import crypto from "crypto";

// // 🚀 PaymentPoint Webhook Route
// export async function POST(request: Request) {
//   try {
//     // ✅ 1. Read raw body as text
//     let rawBody = await request.text();

//     // 🩹 Trim and clean up just in case Postman sends weird formatting
//     rawBody = rawBody.trim();

//     // ✅ 2. Try to parse JSON safely
//     let data;
//     try {
//       data = JSON.parse(rawBody);
//     } catch (err) {
//       console.error("⚠️ Invalid JSON received. Attempting fallback parse...");
//       console.log("🧾 Raw body was:", rawBody);

//       // 🩹 Fallback: try to fix common issues like escaped quotes
//       try {
//         const fixed = rawBody
//           .replace(/(\r\n|\n|\r)/gm, "") // remove line breaks
//           .replace(/\\+"|"\\"/g, '"'); // clean escaped quotes
//         data = JSON.parse(fixed);
//       } catch (fallbackErr) {
//         console.error("❌ Still invalid after fallback:", fallbackErr);
//         return NextResponse.json(
//           { status: "error", message: "Invalid JSON" },
//           { status: 400 }
//         );
//       }
//     }

//     // ✅ 3. Get the PaymentPoint-Signature from headers
//     const signature = request.headers.get("paymentpoint-signature");
//     if (!signature) {
//       console.warn("⚠️ Missing PaymentPoint-Signature header");
//       return NextResponse.json(
//         { status: "error", message: "Missing signature" },
//         { status: 400 }
//       );
//     }

//     // ✅ 4. Use your PaymentPoint secret key
//     const securityKey =
//       process.env.PAYMENTPOINT_WEBHOOK_SECRET ||
//       "b6c78bbe842c103548b6e93360def7a9fee8d89b847e7579ac648206898149e699abec0fc05518faefbc86ce43269dcb90a7e9665895993cfa930fe0";

//     // ✅ 5. Recalculate signature
//     const calculatedSignature = crypto
//       .createHmac("sha256", securityKey)
//       .update(rawBody)
//       .digest("hex");

//     // ✅ 6. Compare both signatures
//     if (calculatedSignature !== signature) {
//       console.error("❌ Invalid signature from PaymentPoint");
//       return NextResponse.json(
//         { status: "error", message: "Invalid signature" },
//         { status: 403 }
//       );
//     }

//     // ✅ 7. Signature valid — extract payment details
//     const {
//       notification_status,
//       transaction_id,
//       amount_paid,
//       settlement_amount,
//       settlement_fee,
//       transaction_status,
//       sender,
//       receiver,
//       description,
//       timestamp,
//     } = data;

//     console.log("✅ PaymentPoint Webhook Received:");
//     console.log("Transaction ID:", transaction_id);
//     console.log("Amount Paid:", amount_paid);
//     console.log("Settlement Amount:", settlement_amount);
//     console.log("Status:", transaction_status);
//     console.log("Receiver:", receiver?.account_number);
//     console.log("Timestamp:", timestamp);

//     // 🔜 (Later: Update Firestore / Wallet / etc.)

//     return NextResponse.json(
//       { status: "success", message: "Webhook processed successfully" },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("🔥 Webhook error:", err);
//     return NextResponse.json(
//       { status: "error", message: err.message },
//       { status: 500 }
//     );
//   }
// }

// // ✅ Optional test route for verification
// export async function GET() {
//   return NextResponse.json({
//     status: "ok",
//     message: "PaymentPoint webhook is active 🚀",
//   });
// }



// import { NextResponse } from "next/server";
// import crypto from "crypto";

// export async function POST(request: Request) {
//   try {
//     // 🔍 Log all headers for debugging
//     console.log("📋 Request headers:");
//     request.headers.forEach((value, key) => {
//       console.log(`  ${key}: ${value}`);
//     });

//     // ✅ 1. Read raw body
//     let rawBody = await request.text();
    
//     console.log("📦 Raw body received:");
//     console.log(rawBody);
//     console.log("📦 Length:", rawBody.length);

//     // Check if empty
//     if (!rawBody || rawBody.length === 0) {
//       return NextResponse.json(
//         { status: "error", message: "Empty request body" },
//         { status: 400 }
//       );
//     }

//     // Remove BOM if present
//     if (rawBody.charCodeAt(0) === 0xFEFF) {
//       rawBody = rawBody.slice(1);
//     }

//     // Trim whitespace
//     rawBody = rawBody.trim();

//     // ✅ 2. Parse JSON
//     let data;
//     try {
//       data = JSON.parse(rawBody);
//     } catch (err) {
//       console.error("⚠️ JSON parse failed:", err);
//       console.log("🧾 Problematic body:", rawBody);
      
//       // Try URL-encoded format (some webhooks send this)
//       if (rawBody.includes('=') && rawBody.includes('&')) {
//         console.log("🔄 Attempting to parse as URL-encoded...");
//         const params = new URLSearchParams(rawBody);
//         const jsonStr = params.get('data') || params.get('payload');
//         if (jsonStr) {
//           try {
//             data = JSON.parse(jsonStr);
//             console.log("✅ Parsed from URL-encoded format");
//           } catch (e) {
//             console.error("❌ URL-encoded parse also failed");
//           }
//         }
//       }
      
//       if (!data) {
//         return NextResponse.json(
//           { 
//             status: "error", 
//             message: "Invalid JSON", 
//             details: err instanceof Error ? err.message : "Parse failed"
//           },
//           { status: 400 }
//         );
//       }
//     }

//     console.log("✅ Parsed data:", JSON.stringify(data, null, 2));

//     // ✅ 3. Verify signature
//     const signature = request.headers.get("paymentpoint-signature");
//     if (!signature) {
//       console.warn("⚠️ Missing PaymentPoint-Signature header");
//       return NextResponse.json(
//         { status: "error", message: "Missing signature" },
//         { status: 400 }
//       );
//     }

//     const securityKey = process.env.PAYMENTPOINT_WEBHOOK_SECRET || 
//       "b6c78bbe842c103548b6e93360def7a9fee8d89b847e7579ac648206898149e699abec0fc05518faefbc86ce43269dcb90a7e9665895993cfa930fe0";

//     const calculatedSignature = crypto
//       .createHmac("sha256", securityKey)
//       .update(rawBody)
//       .digest("hex");

//     console.log("🔐 Signature check:");
//     console.log("  Received:", signature);
//     console.log("  Calculated:", calculatedSignature);

//     if (calculatedSignature !== signature) {
//       console.error("❌ Signature mismatch");
//       return NextResponse.json(
//         { status: "error", message: "Invalid signature" },
//         { status: 403 }
//       );
//     }

//     // ✅ 4. Process webhook data
//     const {
//       notification_status,
//       transaction_id,
//       amount_paid,
//       settlement_amount,
//       settlement_fee,
//       transaction_status,
//       sender,
//       receiver,
//       description,
//       timestamp,
//     } = data;

//     console.log("✅ PaymentPoint Webhook Processed:");
//     console.log({
//       transaction_id,
//       amount_paid,
//       settlement_amount,
//       transaction_status,
//       receiver_account: receiver?.account_number,
//       timestamp
//     });

//     // TODO: Update your database here

//     return NextResponse.json(
//       { status: "success", message: "Webhook processed" },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("🔥 Webhook error:", err);
//     return NextResponse.json(
//       { status: "error", message: err.message },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json({
//     status: "ok",
//     message: "PaymentPoint webhook is active 🚀",
//   });
// }





import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    console.log("=".repeat(60));
    console.log("🔔 PaymentPoint Webhook Received");
    console.log("Timestamp:", new Date().toISOString());

    // Step 1: Read the raw POST data (the JSON payload)
    const clonedRequest = request.clone();
    const rawBody = await request.text();
    
    console.log("📦 Raw body length:", rawBody.length);

    // Check for empty body
    if (!rawBody || rawBody.length === 0) {
      console.error("❌ Empty body received");
      return NextResponse.json(
        { status: "error", message: "Empty request body" },
        { status: 400 }
      );
    }

    // Step 2: Get the signature from the headers (note: lowercase "paymentpoint-signature")
    const signatureHeader = request.headers.get("paymentpoint-signature");
    
    if (!signatureHeader) {
      console.error("❌ Missing Paymentpoint-Signature header");
      return NextResponse.json(
        { status: "error", message: "Missing signature" },
        { status: 400 }
      );
    }

    // Step 3: Get your PaymentPoint secret security key
    const secretKey = "b6c78bbe842c103548b6e93360def7a9fee8d89b847e7579ac648206898149e699abec0fc05518faefbc86ce43269dcb90a7e9665895993cfa930fe0";
    
    if (!secretKey) {
      console.error("❌ PAYMENTPOINT_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { status: "error", message: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Step 4: Calculate the expected signature using HMAC-SHA256
    const calculatedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
      .digest("hex");

    console.log("🔐 Signature Verification:");
    console.log("  Received:", signatureHeader);
    console.log("  Calculated:", calculatedSignature);
    console.log("  Match:", calculatedSignature === signatureHeader);

    // Step 5: Verify if the calculated signature matches the header signature
    if (calculatedSignature !== signatureHeader) {
      console.error("❌ Invalid signature - possible tampering detected");
      return NextResponse.json(
        { status: "error", message: "Invalid signature" },
        { status: 400 }
      );
    }

    console.log("✅ Signature verified successfully!");

    // Step 6: Decode the JSON payload
    let webhookData;
    try {
      webhookData = await clonedRequest.json();
      console.log("✅ JSON parsed successfully");
    } catch (err) {
      console.error("⚠️ Invalid JSON data received:", err);
      return NextResponse.json(
        { status: "error", message: "Invalid JSON data received" },
        { status: 400 }
      );
    }

    // Step 7: Extract relevant data from the webhook
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
    } = webhookData;

    // Check if required data is present
    if (!transaction_id || !amount_paid || !settlement_amount || !transaction_status) {
      console.error("❌ Missing required data");
      return NextResponse.json(
        { status: "error", message: "Missing required data" },
        { status: 400 }
      );
    }

    // Step 8: Log the payment details
    console.log("💰 Payment Notification:");
    console.log({
      notification_status,
      transaction_id,
      amount_paid,
      settlement_amount,
      settlement_fee,
      transaction_status,
      sender_name: sender?.name,
      sender_bank: sender?.bank,
      receiver_account: receiver?.account_number,
      receiver_bank: receiver?.bank,
      customer_name: customer?.name,
      customer_email: customer?.email,
      customer_id: customer?.customer_id,
      timestamp
    });

    // Step 9: Process the webhook data
    if (transaction_status === "success" && notification_status === "payment_successful") {
      console.log("✅ Processing successful payment...");
      
      // 🔥 TODO: Your business logic here
      // Examples:
      
      // 1. Update database with transaction
      // await db.transaction.create({
      //   transactionId: transaction_id,
      //   customerId: customer.customer_id,
      //   amount: amount_paid,
      //   settlementAmount: settlement_amount,
      //   status: 'completed',
      //   timestamp: new Date(timestamp)
      // });
      
      // 2. Credit user's wallet/account
      // await creditUserWallet(customer.customer_id, settlement_amount);
      
      // 3. Send confirmation email
      // await sendPaymentConfirmationEmail({
      //   to: customer.email,
      //   name: customer.name,
      //   amount: amount_paid,
      //   transactionId: transaction_id
      // });
      
      // 4. Log for accounting
      // await logPaymentForAccounting(webhookData);
      
      console.log("✅ Payment processed successfully!");
      console.log(`Transaction ${transaction_id} completed for ${customer?.email}`);
    } else {
      console.warn(`⚠️ Non-successful payment: ${transaction_status}`);
      // Handle failed/pending payments if needed
    }

    console.log("=".repeat(60));

    // Step 10: Respond with 200 OK to acknowledge receipt
    return NextResponse.json(
      { 
        status: "success", 
        message: "Webhook processed successfully",
        transaction_id
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("🔥 Webhook processing error:", err);
    console.error("Stack trace:", err.stack);
    
    // Still return 200 to prevent PaymentPoint from retrying
    return NextResponse.json(
      { status: "error", message: "Internal error" },
      { status: 200 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  const hasSecret = !!process.env.PAYMENTPOINT_WEBHOOK_SECRET;
  
  return NextResponse.json({
    status: "ok",
    message: "PaymentPoint webhook endpoint is active 🚀",
    configured: hasSecret,
    endpoint: "/api/paymentpoint-webhook",
    method: "POST",
    timestamp: new Date().toISOString()
  });
}
