const router = require("express").Router();
const { insertLicense, getAllLicenses } = require("../controllers/Licenses");
const { isLoggedIn, isAdmin } = require("../middlewares/user");

router.post("/", isLoggedIn, isAdmin, async function (req, res) {
  const { shopKeeperUserId, shopId, startDate, endDate } = req.body;
  if (!(shopKeeperUserId && shopId && startDate && endDate))
    return res.status(400).json({
      message: "shopKeeperUserId/shopId/startDate/endDate cannot be empty"
    });
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

module.exports = router;
