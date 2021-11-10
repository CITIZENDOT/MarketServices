const db = require("../db");

async function insertPayment(paymentProps) {
  const { licenseId, paymentType, amount, penalty, dueDate, paymentDate } =
    paymentProps;
  if (
    !(licenseId && paymentType && amount && penalty && dueDate && paymentDate)
  )
    throw Error(
      "licenseId/paymentType/amount/penalty/dueDate/paymentDate cannot be empty"
    );
  try {
    await db.execute(
      "INSERT INTO Payments (licenseId, paymentType, amount, penalty, dueDate, paymentDate) VALUES (?, ?, ?, ?, ?, ?)",
      [licenseId, paymentType, amount, penalty, dueDate, paymentDate || null]
    );
    return "Payment Added successfully";
  } catch (err) {
    throw err;
  }
}

async function getPaymentById(paymentId) {
  try {
    const [row] = await db.execute(
      `SELECT paymentId, Payments.licenseId, paymentType, amount, penalty, dueDate, paymentDate, Licenses.shopKeeperUserId, firstName, lastName, CONCAT_WS(' ', firstName, lastName) AS fullName, Licenses.shopId, shopName
      FROM Payments
      INNER JOIN Licenses ON Payments.licenseId = Licenses.licenseId
      INNER JOIN Users ON Licenses.shopKeeperUserId = Users.userId
      INNER JOIN Shops ON Licenses.shopId = Shops.shopId
      WHERE paymentId = ?`,
      [paymentId]
    );
    return row[0];
  } catch (err) {
    throw err;
  }
}

async function makePayment(paymentId, shopKeeperUserId) {
  try {
    const payment = await getPaymentById(paymentId);
    if (payment.shopKeeperUserId != shopKeeperUserId)
      throw Error("Unauthorized to make the Payment.");
    if (payment.paymentDate != null) throw Error("Payment Already done");
    await db.execute(
      "UPDATE Payments SET paymentDate = CURDATE() WHERE paymentId = ?",
      [paymentId]
    );
    return "Payment Successfull.";
  } catch (err) {
    console.log(err);
    throw Error("Invalid Payment");
  }
}

async function getPaymentsByShopKeeperId(shopKeeperUserId) {
  try {
    const [rows] = await db.execute(
      `SELECT paymentId, Payments.licenseId, paymentType, amount, penalty, dueDate, paymentDate, firstName, lastName, Licenses.shopId, shopName
      FROM Payments
      INNER JOIN Licenses ON Payments.licenseId = Licenses.licenseId
      INNER JOIN Users ON Licenses.shopKeeperUserId = Users.userId
      INNER JOIN Shops ON Licenses.shopId = Shops.shopId
      WHERE Licenses.shopKeeperUserId = ?`,
      [shopKeeperUserId]
    );
    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  insertPayment,
  getPaymentsByShopKeeperId,
  getPaymentById,
  makePayment
};
