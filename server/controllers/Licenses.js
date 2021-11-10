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

/* Returns active licenses */
async function getAllLicenses() {
  try {
    const [rows] = await db.execute(
      `SELECT licenseId, shopKeeperUserId, firstName, lastName, CONCAT_WS(' ', firstName, lastName) AS fullName, Licenses.shopId, shopName, landmark, rentPerMonth, startDate, endDate
      FROM Licenses
      INNER JOIN Users ON Licenses.shopKeeperUserId = Users.userId
      INNER JOIN Shops ON Licenses.shopId = Shops.shopId
      WHERE startDate <= CURDATE() AND CURDATE() <= endDate`
    );
    return rows;
  } catch (err) {
    throw err;
  }
}

async function getLicenseById(licenseId) {
  try {
    const [row] = await db.execute(
      "SELECT * FROM Liceses WHERE licenseId = ?",
      [licenseId]
    );
    return row[0];
  } catch (err) {
    throw err;
  }
}

module.exports = {
  insertLicense,
  getLicenseById,
  getAllLicenses
};
