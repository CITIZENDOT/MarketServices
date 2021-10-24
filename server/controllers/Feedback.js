const db = require("../db");

async function insertFeedback(feedbackProps) {
  const { licenseId, customerId, rating, remarks } = feedbackProps;
  try {
    await db.execute(
      "INSERT INTO Feedbacks (licenseId, customerId, rating, remarks) VALUES (?, ?, ?, ?, ?)",
      [licenseId, customerId, rating, remarks]
    );
    return "Feedback submitted successfully";
  } catch (err) {
    throw err;
  }
}

async function getAllFeedbacks() {
  try {
    const [rows] = await db.execute("SELECT * FROM Feedbacks");
    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  insertFeedback,
  getAllFeedbacks
};
