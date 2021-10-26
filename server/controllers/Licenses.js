const db = require("../db");

async function insertLicense(licenseProps) {
  const { shopKeeperUserId, shopId, startDate, endDate } = licenseProps;
  if (!(shopKeeperUserId && shopId && startDate && endDate))
    throw Error("shopKeeperUserId/shopId/startDate/endDate cannot be empty");
  try {
    await db.execute(
      "INSERT INTO Licenses (shopKeeperUserId, shopId, startDate, endDate) VALUES (?, ?, ?, ?)",
      [shopKeeperUserId, shopId, startDate, endDate]
    );
    return "License Added successfully";
  } catch (err) {
    throw err;
  }
}

/* Returns *active* licenses */
async function getAllLicenses() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM Licenses WHERE startDate <= CURDATE() AND CURDATE() <= endDate"
    );
    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  insertLicense,
  getAllLicenses
};
