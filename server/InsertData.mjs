import { insertUser, getAllUsers } from "./controllers/Users.js";
import { insertShop, getAllShops } from "./controllers/Shops.js";
import { insertGatepass } from "./controllers/Gatepasses.js";
import { insertLicense } from "./controllers/Licenses.js";
import faker from "faker";

function randomInteger(MIN, MAX) {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

function randomDate(MIN, MAX) {
  return new Date(randomInteger(MIN.getTime(), MAX.getTime()));
}


async function insertFakeUsers(
  customerCount = 5,
  shopKeeperCount = 7,
  adminCount = 2
) {
  // this password is used for all users.
  const password = "123456";

  // 5 customers
  for (let i = 0; i < customerCount; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName, "iitp.ac.in");
    await insertUser({
      email,
      userRole: "CUSTOMER",
      firstName,
      lastName,
      password
    });
  }

  // 7 ShopKeepers
  for (let i = 0; i < shopKeeperCount; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName, undefined);
    await insertUser({
      email,
      userRole: "SHOPKEEPER",
      firstName,
      lastName,
      password
    });
  }

  // 2 Admins
  for (let i = 0; i < adminCount; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName, undefined);
    await insertUser({
      email,
      userRole: "ADMIN",
      firstName,
      lastName,
      password
    });
  }
}

async function insertFakeShops(shopCount = 6) {
  // 6 Shops
  for (let i = 0; i < shopCount; i++) {
    await insertShop({
      shopName: faker.company.companyName(),
      landmark: faker.address.streetAddress(),
      rentPerMonth: randomInteger(5000, 30000)
    });
  }
}

async function insertFakeLicenses(shopKeepers, shops) {
  while (shops.length > 0) {
    const randomShopIndex = Math.floor(Math.random() * shops.length);
    const randomUserIndex = Math.floor(Math.random() * shopKeepers.length);
    const startDate = randomDate(new Date("2018-01-01"), new Date());
    const endDate = randomDate(
      new Date(startDate.getTime() + 31536000000),
      new Date("2023-01-01")
    );
    await insertLicense({
      shopKeeperUserId: shopKeepers[randomUserIndex].userId,
      shopId: shops[randomShopIndex].shopId,
      startDate,
      endDate
    });
    shops.splice(randomShopIndex, 1);
  }
}

async function insertGatePasses(shopKeepers) {
  shopKeepers.forEach(async (user, i) => {
    await insertGatepass({
      shopKeeperUserId: user.userId,
      endDate: randomDate(new Date("2021-11-30"), new Date("2023-01-01"))
    });
  });
}

async function main() {
  const customerCount = 10,
    shopKeeperCount = 10,
    adminCount = 3,
    shopCount = 10;
  await insertFakeUsers(customerCount, shopKeeperCount, adminCount);
  await insertFakeShops(shopCount);

  const users = await getAllUsers();
  const shops = await getAllShops();
  const shopKeepers = users.filter((user) => user.userRole === "SHOPKEEPER");
  await insertFakeLicenses(shopKeepers, shops);
  await insertGatePasses(shopKeepers);
  console.log("Done");
}

await main();
