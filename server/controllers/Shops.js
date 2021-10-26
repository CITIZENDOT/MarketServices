const db = require("../db");

async function insertShop(shopProps) {
  const { shopName, landmark, rentPerMonth } = shopProps;
  if (!(shopName && rentPerMonth))
    throw Error("Shopname/rentPerMonth cannot be empty");
  try {
    await db.execute(
      "INSERT INTO Shops (shopName, landmark, rentPerMonth) VALUES (?, ?, ?)",
      [shopName, landmark, rentPerMonth]
    );
    return "Shop added successfully";
  } catch (err) {
    throw err;
  }
}

async function getShop(shopId) {
  try {
    const [row] = await db.execute("SELECT * FROM Shops WHERE shopId = ?", [
      shopId
    ]);
    if (row.length === 0) throw Error("No such Shop");
    return row[0];
  } catch (err) {
    throw err;
  }
}

async function getAllShops() {
  try {
    const [rows] = await db.execute("SELECT * FROM Shops");
    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  insertShop,
  getShop,
  getAllShops
};
