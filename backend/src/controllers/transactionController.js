import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// @desc    Get transaction listings
// @route   GET /api/transactions
// @access  Private (Admin, Accountant, Receptionist)
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const role = req.user.role;

    let query = {};
    if (role === "Receptionist") {
      // Receptionist only sees their own collections
      query.receptionist = userId;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error while fetching transactions" });
  }
};

// @desc    Get aggregate transaction stats
// @route   GET /api/transactions/stats
// @access  Private (Admin, Accountant, Receptionist)
export const getTransactionStats = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const role = req.user.role;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let query = {
      createdAt: { $gte: startOfToday }
    };
    
    if (role === "Receptionist") {
      query.receptionist = userId;
    }

    const transactions = await Transaction.find(query);

    let totalCollected = 0;
    let cash = 0;
    let card = 0;
    let mobile = 0;
    let count = transactions.length;

    transactions.forEach((tx) => {
      totalCollected += tx.amount;
      if (tx.paymentMethod === "Cash") cash += tx.amount;
      else if (tx.paymentMethod === "Card") card += tx.amount;
      else if (tx.paymentMethod === "Mobile Money") mobile += tx.amount;
    });

    // If role is Accountant or Admin, let's also compute the grand total of all time or this month
    let grandTotal = 0;
    if (role === "Accountant" || role === "Admin") {
      const allTx = await Transaction.find({});
      grandTotal = allTx.reduce((sum, tx) => sum + tx.amount, 0);
    }

    res.json({
      today: {
        totalCollected,
        cash,
        card,
        mobile,
        count
      },
      grandTotal
    });
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    res.status(500).json({ message: "Server error while fetching transaction stats" });
  }
};
