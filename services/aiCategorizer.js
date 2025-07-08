require("dotenv/config");
const categoriesData = require("../services/mockCategories");
const { GoogleGenAI, createUserContent } = require("@google/genai");

exports.aiCategorizeTransactions = async (transactions) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Extract all category names from the nested structure
  const allCategories = [
    ...categoriesData.income.map((cat) => cat.name),
    ...categoriesData.expense.map((cat) => cat.name),
    ...categoriesData.transfer.map((cat) => cat.name),
  ];

  const prompt = `You are a transaction categorizer. Your task is to assign each transaction to the most appropriate category from the provided list.

Available categories: ${allCategories.join(", ")}

Instructions:
1. For each transaction, analyze the description/vendor and assign it to the MOST SUITABLE category from the list above
2. Return the result as a JSON array where each object contains: transaction_id, description, amount, assigned_category, confidence_score (0-100)

Transactions to categorize:
${JSON.stringify(transactions, null, 2)}

Return only valid JSON in this format:
[
  {
    "transaction_id": "id_here",
    "description": "transaction_description",
    "amount": transaction_amount,
    "assigned_category": "category_name",
    "confidence_score": 85
  }
]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent([prompt]),
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.2,
      },
    });

    console.log("\n--- AI Analysis Result ---\n");
    console.log(response.text);

    // Parse the response as JSON
    try {
      let jsonText = response.text;
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Remove any leading/trailing whitespace
      jsonText = jsonText.trim();
      
      // Try to extract JSON array if it's embedded in other text
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      
      const parsedResponse = JSON.parse(jsonText);
      return parsedResponse;
    } catch (parseError) {
      console.warn("Could not parse AI response as JSON:", parseError.message);
      console.warn("Raw response:", response.text);
      return { rawResponse: response.text };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
