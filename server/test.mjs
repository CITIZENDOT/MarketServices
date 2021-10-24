import { insertUser } from "./controllers/Users.js";

try {
  const r = await insertUser({
    email: "appaji12368@gmail.com",
    userRole: "CUSTOMER",
    firstName: "Appaji",
    lastName: "Chintimi",
    password: "$2b$10$vcjP55PD8kcEebAgavTUkOrrnOTA121im2sNoPrrY9m8TqoyBUNs."
  });
  console.log(r);
} catch (err) {
  console.log(err);
}
