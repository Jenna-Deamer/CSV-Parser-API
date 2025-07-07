const parse = require("csv-parse/sync").parse;

exports.parseAndMapCSV = (csvContent, mapping) => {
  // Parse the CSV content into an array of objects
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // Transform each CSV row into our standard transaction format
  return records.map((row) => ({
    date: row[mapping.date], // Get the date from the mapped column
    amount: parseFloat(row[mapping.amount]), // Convert amount to number
    memo: row[mapping.memo], // Get the memo/description
    type: row[mapping.type], // Get the transaction type
  }));
};

exports.categorizeTransactionsWithRules = (records, rules) => {
  // Map through all records
  return records.map((transaction) => {
    // Map through all rules with current transaction
    const matchedRule = rules.find((rule) =>
      // Lowercase memo, check if memo contains any keywords from rule
      transaction.memo.toLowerCase().includes(rule.keyword.toLowerCase())
    );

    // return whole transaction object & new category field
    return {
      ...transaction,
      category: matchedRule?.category || "Uncategorized", // Assign category if rule matches, else 'Uncategorized'
    };
  });
};
