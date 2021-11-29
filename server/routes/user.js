const router = require("express").Router();
const {
  getUser,
  insertUser,
  updateUser,
  changePassword
} = require("../controllers/Users");
const { getGatepass } = require("../controllers/Gatepasses");
const { isLoggedIn } = require("../middlewares/user");
const jwt = require("jsonwebtoken");

function createToken(user, gatepass) {
  // Expires in 1hr (or) 3600 seconds (or) 3600000 milliseconds.
  const expiresIn = Date.now() + 3600 * 1000;
  user = JSON.parse(JSON.stringify(user));
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
  return {
    token: `Bearer ${token}`,
    userRole: user.userRole,
    expiresIn: expiresIn,
    gatepass: gatepass
  };
}

router.post("/register", async function (req, res) {
  const { email, userRole, firstName, lastName, password } = req.body;
  try {
    const message = await insertUser({
      email,
      userRole,
      firstName,
      lastName,
      password
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

router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  try {
    let user = await getUser(email, password);
    let gatepass = undefined;
    if (user.userRole === "SHOPKEEPER") {
      gatepass = await getGatepass(user.userId);
      user = {...user, gatepass};
    }

    const tokenObj = createToken(user, gatepass);
    return res.status(200).json(tokenObj);
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});

router.post("/change-password", isLoggedIn, async function (req, res) {
  const { currentPassword, newPassword } = req.body;
  try {
    const message = await changePassword(
      req.user.email,
      currentPassword,
      newPassword
    );
    return res.status(200).json({
      message
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
});

router.get("/profile", isLoggedIn, async function (req, res) {
  const { userId, email, userRole, firstName, lastName } = req.user;
  let gatepass = undefined;
  if (userRole === "SHOPKEEPER") gatepass = await getGatepass(userId);
  return res
    .status(200)
    .json({ email, userRole, firstName, lastName, gatepass });
});

router.put("/profile", isLoggedIn, async function (req, res) {
  const { firstName, lastName, email } = req.body;
  try {
    const message = await updateUser(
      req.user.userId,
      firstName,
      lastName,
      email
    );
    return res.status(200).json(message);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
