const router = require("express").Router();
const { getUser, insertUser, changePassword } = require("../controllers/Users");
const { isLoggedIn } = require("../middlewares/user");
const jwt = require("jsonwebtoken");

function createToken(user) {
  // Expires in 1hr (or) 3600 seconds (or) 3600000 milliseconds.
  const expiresIn = Date.now() + 3600 * 1000;
  user = JSON.parse(JSON.stringify(user));
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
  return {
    token: `Bearer ${token}`,
    userRole: user.userRole,
    expiresIn: expiresIn
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
    const user = await getUser(email, password);
    const tokenObj = createToken(user);
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

router.get("/profile", isLoggedIn, function (req, res) {
  const { email, userRole, firstName, lastName } = req.user;
  return res.status(200).json({ email, userRole, firstName, lastName });
});

module.exports = router;
