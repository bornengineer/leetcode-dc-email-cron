import express from "express";
import { scheduleCronJob } from "./scheduler";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Start the cron job
scheduleCronJob();

// Define the root route
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>LeetCode Daily Challenge Cron Job</title>
      </head>
      <body>
        <h1>LeetCode Daily Challenge Email Cron Job</h1>
        <p>This server is running a cron job that fetches the LeetCode daily challenge question and sends it via email every day at 6 AM.</p>
        <p>You can check the cron logs in <code>cron.log</code> file for details on each execution.</p>
        <p>For more information, visit the <a href="https://www.leetcode.com" target="_blank">LeetCode</a> website.</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
