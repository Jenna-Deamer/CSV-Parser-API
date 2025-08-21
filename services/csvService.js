const parse = require("csv-parse/sync").parse;
const recentTransactions = require("../services/mockRecentTransactions");
const transferKeywords = [
    "transfer out",
    "transfer in",
    "trfout",
    "e_trfout",
    "trfin",
    "e_trfin",
];
const tolerance = 0.05 // Amount tolerance for matching transfers (+/- $0.05)
const dateWindow = 2; // Date window for matching transfers (+/- 2 days)

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

function isPotentialTransfer(memo) {
    const memoLowerCased = memo.toLowerCase();
    // Check if memo contains any transfer keywords
    return transferKeywords.some(keyword => memoLowerCased.includes(keyword));
}

function dateDiffInDays(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
}

exports.detectTransferTransactions = (transactions) => {
    // Step 1: Identify potential transfers in new import
    const potentialTransfers = transactions.filter(txn => isPotentialTransfer(txn.memo));
    // Step 2: Loop through potential transfers and find matches in recent transactions

    // Step 3: Decide match outcome
}
