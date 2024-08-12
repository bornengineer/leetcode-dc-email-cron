import axios from "axios";
import cron from "node-cron";
import sendEmail from "./mailer";
import dotenv from "dotenv";
import { dailyCodingChallengeQuery as query } from "../utils/graphqlQuery";
import logToFile from "../utils/logToFile";

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

// Schedule the cron job
export const scheduleCronJob = (): void => {
  cron.schedule(`${process.env.CRON_SCHEDULE}`, async () => {
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
