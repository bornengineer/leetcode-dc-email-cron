import fs from "fs";
import path from "path";

// Function to log messages to a file
const logToFile = (message: string) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  const logFilePath = path.resolve(__dirname, "cron.log");

  fs.appendFileSync(logFilePath, logMessage);
};

export default logToFile;
