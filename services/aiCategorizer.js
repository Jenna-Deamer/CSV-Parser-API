import fs from "fs";
import path from "path";
import "dotenv/config";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

exports.aiCategorizeTransactions = async (transactions, rules) => {
  console.log("api key", process.env.GEMINI_API_KEY);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // 1. Load CSV
  const csvFile = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "accountactivity.csv"
  );
  if (!fs.existsSync(csvFile)) {
    console.error(`CSV file not found: ${csvFile}`);
    process.exit(1);
  }

  // 2. Upload CSV as a reusable file
  const file = await ai.files.upload({
    file: csvFile,
    config: { mimeType: "text/csv" },
  });
  console.log("Uploaded file URI:", file.uri);

  // 3. Call model with analysis prompt
  const prompt = `extract all the vendors, their categories (you have to assign them such as Grocery/Rent etc), and the amount spend/received on this credit card statement.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      createPartFromUri(file.uri, file.mimeType),
      "\n\n",
      prompt,
    ]),
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.2,
    },
  });

  console.log("\n--- Analysis Result ---\n");
  console.log(response.text);
};

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
