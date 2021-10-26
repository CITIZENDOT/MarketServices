const db = require("../db");

/**
This function inserts row if it doesn't exists.
Else updates the row.
 */
async function insertGatepass(gatepassProps) {
  const { shopKeeperUserId, endDate } = gatepassProps;
  if (!(shopKeeperUserId && endDate))
    throw Error("shopKeeperUserId/EndDate cannot be empty");
  try {
    await db.execute(
      "INSERT INTO Gatepasses (shopKeeperUserId, endDate) VALUES (?, ?) ON DUPLICATE KEY UPDATE `endDate` = endDate",
      [shopKeeperUserId, endDate]
    );
    return "Gatepass added/updated successfully.";
  } catch (err) {
    throw err;
  }
}

async function getGatepass(shopKeeperUserId) {
  try {
    const [row] = await db.execute(
      "SELECT * FROM Gatepasses WHERE shopKeeperUserId = ?",
      [shopKeeperUserId]
    );
    return row[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  insertGatepass,
  getGatepass
};
