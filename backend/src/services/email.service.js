// import axios from "axios";
// import { ApiError } from "../utils/ApiError.js";
// const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// /**
//  * Check if Brevo is configured
//  */
// const isEmailConfigured = () => {
//   return (
//     !!process.env.BREVO_API_KEY &&
//     !!process.env.BREVO_SENDER_EMAIL &&
//     !!process.env.BREVO_SENDER_NAME
//   );
// };

// /**
//  * Send Email using Brevo
//  *
//  * @param {Object} options
//  * @param {string} options.to
//  * @param {string} options.subject
//  * @param {string} options.htmlContent
//  * @param {string} [options.textContent]
//  */
// export const sendEmail = async ({ to, subject, htmlContent, textContent }) => {
//   if (!isEmailConfigured()) {
//     throw new Error("Brevo email service is not configured.");
//   }

//   const payload = {
//     sender: {
//       name: process.env.BREVO_SENDER_NAME,
//       email: process.env.BREVO_SENDER_EMAIL,
//     },

//     to: [
//       {
//         email: to,
//       },
//     ],

//     subject,

//     htmlContent,

//     textContent:
//       textContent ||
//       "Please view this email in an HTML compatible email client.",
//   };

//   try {
//     const response = await axios.post(BREVO_API_URL, payload, {
//       headers: {
//         "api-key": process.env.BREVO_API_KEY,
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       timeout: 10000,
//     });

//     console.log("========================================");
//     console.log("✅ Email sent successfully!");
//     console.log("📧 Brevo Response:");
//     console.log(response.data);
//     console.log("========================================");

//     return response.data;
//   } catch (error) {
//     console.log("========================================");
//     console.error("❌ Brevo Email Error");

//     if (error.response) {
//       console.error("Status:", error.response.status);
//       console.error("Response:", error.response.data);
//     } else {
//       console.error(error.message);
//     }

//     console.log("========================================");

//     throw new ApiError(500, "Failed to send email.");
//   }
// };

import axios from "axios";
import  ApiError  from "../utils/ApiError.js";

const BREVO_API_URL =
  process.env.BREVO_API_URL || "https://api.brevo.com/v3/smtp/email";

/**
 * Check if Brevo email service is configured.
 */
const isEmailConfigured = () => {
  return (
    !!process.env.BREVO_API_KEY &&
    !!process.env.BREVO_SENDER_NAME &&
    !!process.env.BREVO_SENDER_EMAIL
  );
};

/**
 * Send an email using Brevo.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlContent - HTML body
 * @param {string} [options.textContent] - Plain text fallback
 *
 * @returns {Promise<{success:boolean,messageId:string}>}
 */
export const sendEmail = async ({ to, subject, htmlContent, textContent }) => {
  // Validate Brevo configuration
  if (!isEmailConfigured()) {
    throw new ApiError(500, "Brevo email service is not configured properly.");
  }

  // Validate required fields
  if (!to || !subject || !htmlContent) {
    throw new ApiError(
      400,
      "Recipient email, subject and htmlContent are required.",
    );
  }

  const payload = {
    sender: {
      name: process.env.BREVO_SENDER_NAME,
      email: process.env.BREVO_SENDER_EMAIL,
    },

    to: [
      {
        email: to,
      },
    ],

    subject,

    htmlContent,

    textContent:
      textContent ||
      "Please view this email in an HTML compatible email client.",
  };

  try {
    const response = await axios.post(BREVO_API_URL, payload, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("========================================");
      console.log("✅ Email sent successfully");
      console.log("Message ID:", response.data.messageId);
      console.log("========================================");
    }

    return {
      success: true,
      messageId: response.data.messageId,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("========================================");
      console.error("❌ Failed to send email");

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);
      } else {
        console.error(error.message);
      }

      console.error("========================================");
    }

    throw new ApiError(
      error.response?.status || 500,
      error.response?.data?.message ||
        "Unable to send email. Please try again later.",
    );
  }
};