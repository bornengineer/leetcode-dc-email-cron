import nodemailer from "nodemailer";
import formatDate from "../utils/formatDate";
import dotenv from "dotenv";

dotenv.config();

// Function to send an email
const sendEmail = async (question: any): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });

  const prettifiedJson = JSON.stringify(question, null, 2);

  // Escape HTML characters to prevent HTML injection
  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const escapedJson = escapeHtml(prettifiedJson);

  const mailOptions = {
    from: `${process.env.SMTP_USERNAME} <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_RECEIVERS,
    subject: `Today's Leetcode Daily Challenge (${formatDate(question.date)})`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Leetcode Daily Challenge</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 18px; /* Increased font size */
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 100%; /* Full width */
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h1 {
                font-size: 28px; /* Increased font size */
                margin: 0;
            }
            .content {
                margin-bottom: 20px;
            }
            .content a {
                color: #1a0dab;
                text-decoration: none;
            }
            .content a:hover {
                text-decoration: underline;
            }
            .footer {
                font-size: 14px; /* Increased font size */
                color: #888;
                margin-top: 20px;
            }
            .pre {
                white-space: pre-wrap;
                word-wrap: break-word;
                background-color: #f5f5f5;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Leetcode Daily Challenge</h1>
            </div>
            <div class="content">
                <p><strong>Title:</strong> ${question.question.title}</p>
                <p><strong>Difficulty:</strong> ${
                  question.question.difficulty
                }</p>
                <p><strong>Link:</strong> <a href="https://www.leetcode.com${
                  question.link
                }" target="_blank">https://www.leetcode.com${
      question.link
    }</a></p>
                <p><strong>Date:</strong> ${formatDate(question.date)}</p>
            </div>
            <div class="footer">
                <p><strong>Full Data:</strong></p>
                <pre class="pre">${escapedJson}</pre>
            </div>
        </div>
    </body>
    </html>
    `,
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("mail sharing failed: ", error);
        reject(error);
      } else {
        resolve(info);
        console.log("mail shared: " + info.response);
      }
    });
  });
};

export default sendEmail;
