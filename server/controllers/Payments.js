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
      `INSERT INTO Payments (licenseId, paymentType, amount, penalty, dueDate, paymentDate)
      VALUES (?, ?, ?, ?, ?, ?)`,
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
      `SELECT
      paymentId, paymentStatus, Payments.licenseId, paymentType, amount, penalty, dueDate, paymentDate,
      Licenses.shopKeeperUserId, firstName, lastName,
      CONCAT_WS(' ', firstName, lastName) AS fullName, Licenses.shopId, shopName
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
      "UPDATE Payments SET paymentDate = CURDATE(), paymentStatus='PENDING APPROVAL' WHERE paymentId = ?",
      [paymentId]
    );
    return "Payment Successfull.";
  } catch (err) {
    throw Error("Invalid Payment");
  }
}

async function confirmPayment(paymentId) {
  try {
    const payment = await getPaymentById(paymentId);
    if (payment.paymentStatus === "PENDING APPROVAL") {
      const [result] = await db.execute(
        "UPDATE Payments SET paymentStatus='PAID' WHERE paymentId = ?",
        [paymentId]
      );
      return "Approved";
    }
  } catch (err) {
    throw Error("Invalid Payment");
  }
}

async function getPaymentsByShopKeeperId(shopKeeperUserId) {
  const [rows] = await db.execute(
    `SELECT
    paymentId, Payments.licenseId, paymentType, paymentStatus, amount, penalty, dueDate, paymentDate,
    firstName, lastName,
    CONCAT_WS(' ', firstName, lastName) AS fullName, Licenses.shopId, shopName
    FROM Payments
    INNER JOIN Licenses ON Payments.licenseId = Licenses.licenseId
    INNER JOIN Users ON Licenses.shopKeeperUserId = Users.userId
    INNER JOIN Shops ON Licenses.shopId = Shops.shopId
    WHERE Licenses.shopKeeperUserId = ?`,
    [shopKeeperUserId]
  );
  return rows;
}

async function getPendingPayments() {
  const [rows] = await db.execute(
    `SELECT
    paymentId, Payments.licenseId, paymentType, paymentStatus, amount, penalty, dueDate, paymentDate,
    firstName, lastName,
    CONCAT_WS(' ', firstName, lastName) AS fullName, Licenses.shopId, shopName
    FROM Payments
    INNER JOIN Licenses ON Payments.licenseId = Licenses.licenseId
    INNER JOIN Users ON Licenses.shopKeeperUserId = Users.userId
    INNER JOIN Shops ON Licenses.shopId = Shops.shopId
    WHERE paymentStatus = 'PENDING APPROVAL'`
  );
  return rows;
}

async function getAllPayments() {
  const [rows] = await db.execute(
    `SELECT
    paymentId, Payments.licenseId, paymentType, paymentStatus, amount, penalty, dueDate, paymentDate,
    firstName, lastName,
    CONCAT_WS(' ', firstName, lastName) AS fullName, Licenses.shopId, shopName
    FROM Payments
    INNER JOIN Licenses ON Payments.licenseId = Licenses.licenseId
    INNER JOIN Users ON Licenses.shopKeeperUserId = Users.userId
    INNER JOIN Shops ON Licenses.shopId = Shops.shopId`
  );
  return rows;
}

module.exports = {
  insertPayment,
  getPaymentsByShopKeeperId,
  getPaymentById,
  makePayment,
  confirmPayment,
  getPendingPayments,
  getAllPayments
};
