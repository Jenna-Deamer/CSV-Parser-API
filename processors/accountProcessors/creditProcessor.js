exports.creditProcessor = (transactions) => {
  transactions.forEach((transaction) => {
    // Determine direction based on Credit or Debit
    if (transaction.type.toLowerCase() === "Credit") {
      transaction.direction = "in"; // Credit means money coming in
    } else {
      transaction.direction = "out"; // Debit means money going out
    }
  });

  return transactions;
};
