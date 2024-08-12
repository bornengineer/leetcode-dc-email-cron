import axios from "axios";
import cron from "node-cron";
import fs from "fs";
import path from "path";
import sendEmail from "./mailer";
import dotenv from "dotenv";
import { dailyCodingChallengeQuery as query } from "../utils/graphqlQuery";

dotenv.config();

// Function to call the GraphQL API
const callGraphQLApi = async (): Promise<any> => {
  try {
    const response = await axios.post(process.env.API_ENDPOINT as string, {
      query,
    });
    return response.data.data.activeDailyCodingChallengeQuestion;
  } catch (error) {
    console.error("Error calling GraphQL API:", error);
    throw new Error("Error calling GraphQL API");
  }
};

// Function to log messages to a file
const logToFile = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  const logFilePath = path.resolve(__dirname, "cron.log");

  fs.appendFileSync(logFilePath, logMessage);
};

// Schedule the cron job
export const scheduleCronJob = (): void => {
  cron.schedule("*/1 * * * *", async () => {
    logToFile("Cron job started");
    try {
      const apiData = await callGraphQLApi();
      console.log("API Data:", apiData);
      await sendEmail(apiData);
      logToFile("Cron job completed successfully");
    } catch (error: unknown) {
      if (error instanceof Error)
        logToFile(`Cron job failed: ${error.message}`);
    }
  });
};
