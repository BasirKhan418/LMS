import admin from "firebase-admin";
import { NextResponse } from "next/server";
import NotificationToken from "../../../../../models/NotificationToken";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require("../../../../app/service_key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(request) {
  try {
    const { title, message, link, id } = await request.json();

    // Fetch the notification token from the database
    const data = await NotificationToken.findOne({ _id: id });

    if (!data || !data.token) {
      return NextResponse.json({
        success: false,
        message: "No valid token found for the given ID.",
      });
    }

    // Ensure token is an array
    const tokens = Array.isArray(data.token) ? data.token : [data.token];

    console.log("Tokens:", tokens);

    // Define the payload for notifications
    const payload = {
      notification: {
        title: title,
        body: message,
        image:
          "https://res.cloudinary.com/db0x5vhbk/image/upload/v1733634184/x0vx8af6jmxfpp5tjjjk.png",
      },
      data: {
        link: link || "",
      },
    };

    console.log("Payload:", payload);

    // Use Firebase's `send` method
    const messaging = admin.messaging();
    const responses = await Promise.all(
      tokens.map((token) =>
        messaging.send({
          token,
          ...payload,
        })
      )
    );

    console.log("Responses:", responses);

    // Collect failed tokens
    const failedTokens = responses
      .map((response, idx) => (response.error ? tokens[idx] : null))
      .filter(Boolean);

    // Return the response
    return NextResponse.json({
      success: true,
      message: "Notifications sent!",
      failures: failedTokens,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
