const db = require("../db");
const { v4: uuidv4 } = require('uuid');

async function insertFeedback(feedbackProps) {
  const { licenseId, customerId, rating, remarks } = feedbackProps;
  if (!(licenseId && !(rating % 1)))
    throw Error("licenseId/rating cannot be empty");
  try {
    await db.execute(
      "INSERT INTO Feedbacks (licenseId, customerId, rating, remarks) VALUES (?, ?, ?, ?)",
      [licenseId, customerId, rating, remarks]
    );
    return "Feedback submitted successfully";
  } catch (err) {
    // console.log(err);
    if (err.code === "ER_DUP_ENTRY")
      throw Error("You have already submitted Feedback");
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

async function getGroupByFeedbacks(groupBy) {
  const queries = {
    Shop: `SELECT Licenses.shopId, shopName, COUNT(*) as count, IFNULL(SUM(rating), NULL) / COUNT(*) as rating
    FROM Licenses
    LEFT JOIN Feedbacks ON Licenses.licenseId = Feedbacks.licenseId
    LEFT JOIN Users ON Licenses.shopKeeperUserId = Users.userId
    LEFT JOIN Shops ON Licenses.shopId = Shops.shopId GROUP BY shopId`,
    "Shop Keeper": `SELECT Licenses.shopKeeperUserId, CONCAT_WS(' ', firstName, lastName) AS fullName, COUNT(*) as count, IFNULL(SUM(rating), NULL) / COUNT(*) as rating
    FROM Licenses
    LEFT JOIN Feedbacks ON Licenses.licenseId = Feedbacks.licenseId
    LEFT JOIN Users ON Licenses.shopKeeperUserId = Users.userId
    LEFT JOIN Shops ON Licenses.shopId = Shops.shopId GROUP BY shopKeeperUserId`,
    "List All": `SELECT shopName, CONCAT_WS(' ', firstName, lastName) AS shopKeeperName, rating, remarks
    FROM Feedbacks
    JOIN Licenses ON Feedbacks.licenseId = Licenses.licenseId
    JOIN Users ON Licenses.shopKeeperUserId = Users.userId
    JOIN Shops ON Licenses.shopId = Shops.shopId`
  };
  if (queries[groupBy] == undefined) groupBy = "Shop";
  const [rows] = await db.execute(queries[groupBy]);
  rows.forEach(function(row, index) {
    rows[index]['id'] = uuidv4();
  })
  return rows;
}

module.exports = {
  insertFeedback,
  getAllFeedbacks,
  getGroupByFeedbacks
};
