const router = require("express").Router();
const {
  insertLicense,
  getAllLicenses,
  extendLicense
} = require("../controllers/Licenses");
const { isLoggedIn, isAdmin, isShopKeeper } = require("../middlewares/user");

router.post("/", isLoggedIn, isAdmin, async function (req, res) {
  const { shopKeeperUserId, shopId, startDate, endDate } = req.body;
  try {
    const message = await insertLicense({
      shopKeeperUserId,
      shopId,
      startDate,
      endDate
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

router.get("/all", isLoggedIn, async function (req, res) {
  try {
    const rows = await getAllLicenses();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post("/extend", isLoggedIn, isAdmin, async function (req, res) {
  let { licenseId, endDate } = req.body;
  try {
    const message = await extendLicense(licenseId, endDate);
    return res.status(200).json({ message });
  } catch (err) {
    return res.status(400).json({
      message: "Failed to update license"
    });
  }
});

module.exports = router;
