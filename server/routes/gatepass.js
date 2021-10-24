const router = require("express").Router();
const { insertGatepass, getGatepass } = require("../controllers/Gatepasses");
const { isLoggedIn, isAdmin } = require("../middlewares/user");

router.post("/", isLoggedIn, isAdmin, async function (req, res) {
  const { shopKeeperUserId, endDate } = req.body;
  if (!(shopKeeperUserId && endDate))
    return res.status(400).json({
      message: "shopKeeperUserId/EndDate cannot be empty"
    });
  try {
    const message = await insertGatepass({
      shopKeeperUserId,
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

router.get("/:shopKeeperUserId", isLoggedIn, async function (req, res) {
  const shopKeeperUserId = req.params.shopKeeperUserId;
  try {
    const gatepass = getGatepass(shopKeeperUserId);
    res.status(200).json(gatepass);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;
