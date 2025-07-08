const csvService = require("../services/csvService");
const rules = require("../services/mockCategoryRules");
const aiCategorizer = require("../services/aiCategorizer");

exports.handleUpload = async (req, res) => {
  try {
    // Extract the file content as a UTF-8 string
    const fileBuffer = req.file.buffer.toString("utf-8");

    // Parse the mapping object from the request body
    const mapping = JSON.parse(req.body.mapping);

    // Get the selected account identifier
    const account = req.body.account;

    console.log("=== BACKEND RECEIVED DATA ===");
    console.log("File received:", {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      preview:
        fileBuffer.substring(0, 200) + (fileBuffer.length > 200 ? "..." : ""),
    });
    console.log("Mappings received:", mapping);
    console.log("Selected account:", account);
    console.log("==============================");

    // Process the CSV file using CSVService
    const transactions = csvService.parseAndMapCSV(fileBuffer, mapping);
    console.log("Parsed transactions:", transactions);

    // Categorize transactions using the rules
    const categorizedTransactions = csvService.categorizeTransactionsWithRules(
      transactions,
      rules
    );
    console.log("Categorized transactions:", categorizedTransactions);

    // Create list of uncategorized transactions and pass to AI for categorization
    const uncategorizedTransactions = categorizedTransactions.filter(
      (transactions) => transactions.category === "Uncategorized"
    );
    console.log("Uncategorized transactions:", uncategorizedTransactions);
    // const aiCategorizedTransactions = await aiCategorizer.aiCategorizeTransactions(uncategorizedTransactions);
    // console.log("AI Categorized transactions:", aiCategorizedTransactions);

    // Return success response with processed data
    return res.status(200).json({
      message: "Upload processed",
      account,
      transactions: categorizedTransactions,
    });
  } catch (error) {
    // Handle any errors that occur during processing
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Failed to process upload." });
  }
};
