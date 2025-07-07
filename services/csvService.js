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
    // Convert memo to lowercase for case-insensitive matching
    const lowerMemo = transaction.memo.toLowerCase();
    
    // Find all matching rules for this transaction
    const matchedRules = rules.filter((rule) =>
      lowerMemo.includes(rule.keyword.toLowerCase())
    );

    // If multiple rules match, prioritize by order in rules array (first match wins)
    // !Users should have a way to order their rules in the UI
    const bestMatch = matchedRules.length > 0 ? matchedRules[0] : null;

    // return whole transaction object & new category field
    return {
      ...transaction,
      category: bestMatch?.category || "Uncategorized", // Assign category if rule matches, else 'Uncategorized'
      matchedKeywords: matchedRules.map(rule => rule.keyword) // track which keywords matched for debugging
    };
  });
};
