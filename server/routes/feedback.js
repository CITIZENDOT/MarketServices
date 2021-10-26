const router = require("express").Router();
const { insertFeedback, getAllFeedbacks } = require("../controllers/Feedback");
const { isLoggedIn, isCustomer, isAdmin } = require("../middlewares/user");

router.post("/", isLoggedIn, isCustomer, async function (req, res) {
  const { licenseId, rating, remarks } = req.body;
  const customerId = req.user.userId;
  try {
    const message = await insertFeedback({
      licenseId,
      customerId,
      rating,
      remarks: remarks || null
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

router.get("/", isLoggedIn, isAdmin, async function (req, res) {
  try {
    const rows = await getAllFeedbacks();
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;
