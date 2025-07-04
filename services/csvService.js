const parse = require('csv-parse/sync').parse; 

exports.parseAndMapCSV = (csvContent, mapping) => {
  // Parse the CSV content into an array of objects
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // Transform each CSV row into our standard transaction format
  return records.map(row => ({
    date: row[mapping.date],           // Get the date from the mapped column
    amount: parseFloat(row[mapping.amount]), // Convert amount to number
    memo: row[mapping.memo],           // Get the memo/description
    type: row[mapping.type],           // Get the transaction type
  }));
};
