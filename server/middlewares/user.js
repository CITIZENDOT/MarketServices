const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7, authHeader.length);
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    } catch (err) {
      return res.status(400).json({
        message: "You have to login before viewing requested page"
      });
    }
  } else
    return res.status(400).json({
      message: "You have to login before viewing requested page"
    });
}

/* This middleware is to be used only AFTER isLoggedIn middleware. */
function isAdmin(req, res, next) {
  if (req.user.userRole === "ADMIN") next();
  else
    return res.status(403).json({
      message: "Unauthorized"
    });
}

/* This middleware is to be used only AFTER isLoggedIn middleware. */
function isShopKeeper(req, res, next) {
  if (req.user.userRole === "SHOPKEEPER") next();
  else
    return res.status(403).json({
      message: "Unauthorized"
    });
}

/* This middleware is to be used only AFTER isLoggedIn middleware. */
function isCustomer(req, res, next) {
  if (req.user.userRole === "CUSTOMER") next();
  else
    return res.status(403).json({
      message: "Unauthorized"
    });
}

module.exports = {
  isLoggedIn,
  isAdmin,
  isShopKeeper,
  isCustomer
};
