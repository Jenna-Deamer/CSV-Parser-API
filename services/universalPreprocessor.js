const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

exports.universalPreprocessor = (transactions) => {
  transactions.forEach((transaction) => {
    // Trim & sanitize strings
    if (transaction.description) {
      transaction.description = transaction.description
        .trim()
        .replace(/[^\x20-\x7E]/g, ""); // Remove non-ASCII junk (e.g., Â®)
    }

    if (transaction.memo) {
      transaction.memo = transaction.memo.trim().replace(/[^\x20-\x7E]/g, "");
    }

    // Standardize dates
    const parseDate = dayjs(transaction.date, [
      "YYYY-MM-DD",
      "MM/DD/YYYY",
      "DD/MM/YYYY",
    ]);

    if (parseDate.isValid()) {
      transaction.date = parseDate.format("YYYY-MM-DD");
    } else {
      console.warn(
        `Invalid date format for transaction: ${JSON.stringify(transaction)}`
      );
    }

    // Normalize amounts
    const rawAmount = parseFloat(
      String(transaction.amount).replace(/[$,]/g, "") // remove currency symbols or commas
    );
    if (!isNaN(rawAmount)) {
      // Preserve original amount for reference
      transaction.originalAmount = transaction.amount;
      
      // Store Direction (in or out) based on sign
      transaction.direction = rawAmount < 0 ? "out" : "in";

      // Store as positive
      transaction.amount = Math.abs(rawAmount); // abs returns absolute value of a int (removes negative sign)
    } // if value is not a number
    else {
      console.warn(
        `Invalid amount format for transaction: ${JSON.stringify(transaction)}`
      );
      transaction.amount = 0; // Default to 0
      transaction.direction = "unknown";
    }
  });
  

  return transactions;
};
