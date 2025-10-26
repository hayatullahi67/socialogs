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
    console.log("🔔 WEBHOOK ENDPOINT HIT");
    console.log("Timestamp:", new Date().toISOString());
    console.log("URL:", request.url);
    console.log("Method:", request.method);
    
    // Log ALL headers
    console.log("📋 Headers:");
    request.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    
    // Check content-type
    const contentType = request.headers.get("content-type");
    console.log("Content-Type:", contentType);
    
    // Check content-length
    const contentLength = request.headers.get("content-length");
    console.log("Content-Length:", contentLength);
    
    // Try multiple ways to read the body
    const clonedRequest = request.clone();
    let rawBody = "";
    
    try {
      rawBody = await request.text();
      console.log("📦 Raw body length:", rawBody.length);
      console.log("📦 Raw body preview:", rawBody.substring(0, 500));
    } catch (readError) {
      console.error("❌ Error reading body:", readError);
    }

    // Check for empty body
    if (!rawBody || rawBody.length === 0) {
      console.error("❌ Empty body received");
      console.log("This means PaymentPoint either:");
      console.log("  1. Isn't sending data");
      console.log("  2. Sending data in a different format");
      console.log("  3. The webhook URL is incorrect");
      
      return NextResponse.json(
        { 
          status: "error", 
          message: "Empty request body",
          contentType,
          contentLength,
          headers: Object.fromEntries(request.headers)
        },
        { status: 400 }
      );
    }

    // Parse JSON
    let data;
    try {
      data = await clonedRequest.json();
      console.log("✅ JSON parsed successfully");
      console.log("Data keys:", Object.keys(data));
    } catch (err) {
      console.error("⚠️ JSON parse error:", err);
      console.log("Raw body was:", rawBody);
      return NextResponse.json(
        { status: "error", message: "Invalid JSON" },
        { status: 400 }
      );
    }

    // Get signature from headers
    const signature = request.headers.get("paymentpoint-signature");
    
    if (!signature) {
      console.error("❌ Missing PaymentPoint-Signature header");
      return NextResponse.json(
        { status: "error", message: "Missing signature" },
        { status: 400 }
      );
    }

    // Get webhook secret from environment
    const secret = process.env.PAYMENTPOINT_WEBHOOK_SECRET;
    
    if (!secret) {
      console.error("❌ PAYMENTPOINT_WEBHOOK_SECRET not set in environment");
      return NextResponse.json(
        { status: "error", message: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Calculate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    // Verify signature
    if (signature !== expectedSignature) {
      console.error("❌ Signature verification failed");
      console.log("Received signature:", signature);
      console.log("Expected signature:", expectedSignature);
      return NextResponse.json(
        { status: "error", message: "Invalid signature" },
        { status: 403 }
      );
    }

    console.log("✅ Signature verified!");

    // Extract payment data
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

    console.log("💰 Payment Details:");
    console.log({
      notification_status,
      transaction_id,
      amount_paid,
      settlement_amount,
      transaction_status,
      customer_email: customer?.email,
      customer_id: customer?.customer_id,
      timestamp
    });

    // Process successful payments
    if (transaction_status === "success" && notification_status === "payment_successful") {
      console.log("✅ Processing successful payment...");
      
      // TODO: Add your business logic here
      
      console.log("✅ Payment processed successfully!");
    } else {
      console.warn("⚠️ Non-successful payment status:", transaction_status);
    }

    console.log("=".repeat(60));

    // Always return 200 to acknowledge webhook receipt
    return NextResponse.json(
      { 
        status: "success", 
        message: "Webhook processed",
        transaction_id 
      },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("🔥 Webhook error:", err);
    console.error("Error stack:", err.stack);
    
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 200 }
    );
  }
}

// Health check endpoint
export async function GET() {
  const hasSecret = !!process.env.PAYMENTPOINT_WEBHOOK_SECRET;
  
  return NextResponse.json({
    status: "ok",
    message: "PaymentPoint webhook is active 🚀",
    configured: hasSecret,
    timestamp: new Date().toISOString(),
    url: "POST to this endpoint to receive webhooks"
  });
}
