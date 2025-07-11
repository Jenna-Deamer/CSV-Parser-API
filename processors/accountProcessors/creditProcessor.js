exports.creditProcessor = (transactions) => {
  transactions.forEach((transaction) => {
    // Clear out memo (contains junk like rewards earned and cashback categories. Confuses the AI) the name has more useful information
    transaction.memo = "";
    // Determine direction based on Credit or Debit
    if (transaction.type.toLowerCase() === "Credit") {
      transaction.direction = "in"; // Credit means money coming in
    } else {
      transaction.direction = "out"; // Debit means money going out
    }
  });

  return transactions;
};
