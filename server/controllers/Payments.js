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
      "INSERT INTO Licenses (licenseId, paymentType, amount, penalty, dueDate, paymentDate) VALUES (?, ?, ?, ?)",
      [licenseId, paymentType, amount, penalty, dueDate, paymentDate]
    );
    return "License Added successfully";
  } catch (err) {
    throw err;
  }
}

module.exports = {
  insertPayment
};
