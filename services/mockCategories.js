module.exports = {
  income: [
    { name: "Salary", description: "Primary employment income" },
    { name: "Freelance", description: "Side jobs and contract work" },
    { name: "Investments", description: "Dividends, interest, and returns" },
    { name: "Gifts", description: "Cash gifts or transfers from others" },
    { name: "Refunds", description: "Refunds from purchases or services" },
    {
      name: "Other Income",
      description: "Income that doesn't fit other categories",
    },
  ],
  expense: [
    { name: "Groceries", description: "Supermarkets, food stores" },
    { name: "Dining Out", description: "Restaurants, cafes, fast food" },
    { name: "Transportation", description: "Gas, transit, rideshare" },
    { name: "Housing", description: "Rent, mortgage, property tax" },
    { name: "Utilities", description: "Hydro, water, internet, phone" },
    { name: "Health", description: "Pharmacy, medical, dental" },
    { name: "Subscriptions", description: "Netflix, Spotify, cloud storage" },
    { name: "Shopping", description: "Retail, online orders" },
    { name: "Education", description: "Books, courses, tuition" },
    { name: "Entertainment", description: "Movies, games, events" },
    { name: "Gifts & Donations", description: "Charity, presents" },
    {
      name: "Fees & Interest",
      description: "Bank fees, overdraft, interest charges",
    },
    { name: "Other Expenses", description: "Miscellaneous spending" },
  ],
  transfer: [
    { name: "Transfer to Savings", description: "Moving funds into savings" },
    { name: "Transfer to Investments", description: "Investment deposits" },
    { name: "Transfer to another account", description: "Transfer" },
    {
      name: "TFSA Contribution",
      description: "Contribution to TFSA",
      allowedAccountTypes: ["Investment"],
    },
    {
      name: "TFSA Withdrawal",
      description: "Withdrawal from TFSA",
      allowedAccountTypes: ["Investment"],
    },
    { name: "Credit Card Payment", description: "Paying off a credit card" },
    {
      name: "Cash Withdrawal",
      description: "ATM or in-person cash withdrawal",
    },
    { name: "Cash Deposit", description: "Depositing physical cash" },
  ],
  payment: [
    {
      name: "Credit Card Bill",
      description: "Full or partial monthly payment",
    },
    { name: "Loan Payment", description: "Regular loan repayment" },
    { name: "Other Payment", description: "Miscellaneous non-expense payment" },
  ],
};
