const db = require("../db");
const bcrypt = require("bcrypt");

async function insertUser(userProps) {
  const { email, userRole, firstName, lastName, password } = userProps;
  if (!(email && userRole && firstName && password))
    throw Error("Email/UserRole/FirstName/Password cannot be empty");
  // if (userRole != "CUSTOMER" && userRole != "SHOPKEEPER")
  //   throw Error("UserRole must be either 'CUSTOMER' OR 'SHOPKEEPER'");
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.execute(
      "INSERT INTO Users (email, userRole, firstName, lastName, hashedPassword) VALUES (?, ?, ?, ?, ?)",
      [email, userRole, firstName, lastName || null, hashedPassword]
    );
    return "User successfully registered. You may now login.";
  } catch (err) {
    if (err.errno === 1062)
      throw Error(
        "User already exists with given email. Please choose other email (or) Login with the given email"
      );
    else if (err.errno === 3819)
      throw Error("Given email is invalid. Please Recheck and submit it again");
    throw err;
  }
}

async function updateUser(userId, firstName, lastName, email) {
  try {
    await db.execute(
      "UPDATE Users SET firstName = ?, lastName = ?, email = ? WHERE userId = ?",
      [firstName, lastName, email, userId]
    );
    return "Profile Successfully updated";
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      throw Error(
        "A user already exists with email. Please use different email"
      );
    throw Error("Failed to update profile. Please try again");
  }
}

async function getUser(email, password) {
  if (!(email && password)) throw Error("Email/Password cannot be empty");
  try {
    const [rows] = await db.execute("SELECT * FROM Users WHERE email = ?", [
      email
    ]);
    if (rows.length == 0) throw Error("Email/Password is incorrect");
    const user = rows[0];
    const matched = await bcrypt.compare(password, user.hashedPassword);
    if (matched) return user;
    throw Error("Email/Password is incorrect");
  } catch (err) {
    throw err;
  }
}

async function changePassword(email, currentPassword, newPassword) {
  try {
    await getUser(email, currentPassword);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE Users SET hashedPassword = ? WHERE email = ?", [
      hashedPassword,
      email
    ]);
    return "Password changed successfully";
  } catch (err) {
    throw err;
  }
}

async function getAllUsers() {
  try {
    const [rows] = await db.execute("SELECT * FROM Users");
    return rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  insertUser,
  getUser,
  updateUser,
  changePassword,
  getAllUsers
};
