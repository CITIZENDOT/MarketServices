const router = require("express").Router();
const {
  insertPayment,
  getPaymentsByShopKeeperId,
  getPaymentById,
  makePayment
} = require("../controllers/Payments");
const { getLicenseById } = require("../controllers/Licenses");
const { isLoggedIn, isShopKeeper, isAdmin } = require("../middlewares/user");

router.post("/", isLoggedIn, isShopKeeper, async function (req, res) {
  const { licenseId, paymentType, amount, penalty, dueDate, paymentDate } =
    req.body;
  const license = await getLicenseById(licenseId);
  if (req.user.userId === license.shopKeeperUserId) {
    try {
      const message = await insertPayment({
        licenseId,
        paymentType,
        amount,
        penalty,
        dueDate,
        paymentDate
      });
      return res.status(200).json({ message });
    } catch (err) {
      return res.status(400).json({
        message: err.message
      });
    }
  } else throw Error("Mind your own business :)");
});

router.get("/my", isLoggedIn, isShopKeeper, async function (req, res) {
  const shopKeeperUserId = req.user.userId;
  try {
    const payments = await getPaymentsByShopKeeperId(shopKeeperUserId);
    return res.status(200).json(payments);
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});

router.get(
  "/pay/:paymentId",
  isLoggedIn,
  isShopKeeper,
  async function (req, res) {
    const paymentId = req.params.paymentId;
    try {
      const message = await makePayment(paymentId, req.user.userId);
      return res.status(200).json({ message });
    } catch (err) {
      return res.status(400).json({
        message: err.message
      });
    }
  }
);

module.exports = router;
