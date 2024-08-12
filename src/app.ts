import express from "express";
import { scheduleCronJob } from "./scheduler";

const app = express();
const PORT = process.env.PORT || 3000;

// Start the cron job
scheduleCronJob();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
