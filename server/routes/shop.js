const router = require("express").Router();
const { insertShop, getShop } = require("../controllers/Shops");
const { isLoggedIn, isAdmin } = require("../middlewares/user");

router.post("/", isLoggedIn, isAdmin, async function (req, res) {
  const { shopName, landmark, rentPerMonth } = req.body;

  try {
    const message = await insertShop({
      shopName,
      landmark: landmark || null,
      rentPerMonth
    });
    return res.status(200).json({
      message
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});

router.get("/:shopId", isLoggedIn, async function (req, res) {
  const shopId = req.params.shopId;
  try {
    const shop = getShop(shopId);
    res.status(200).json(shop);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
