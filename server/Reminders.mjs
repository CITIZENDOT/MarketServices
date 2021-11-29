import nodemailer from "nodemailer";
import { getAllLicenses } from "./controllers/Licenses.js";

const EMAIL = "appaji12368@gmail.com";
const PASSWORD = "secret";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendMails() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD
    }
  });
  console.log("starting...");
  const baseMailOptions = {
    from: process.env.EMAIL,
    subject: "[MarketServices] License Expiry"
  };
  const licenses = await getAllLicenses();

  licenses.forEach(function (license, _) {
    const diffTime = Math.abs(new Date(license.endDate) - new Date());
    const dayDifff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(dayDifff);
    if (dayDifff <= 200) {
      const mailOptions = {
        ...baseMailOptions,
        to: license.email,
        text: `One of your license is about to expire soon. Renewal it to continue your ownership.`,
        html: `<p>One of your license is about to expire soon. Renewal it to continue your ownership.</p>`
      };
      console.log(license);
      transporter.sendMail(mailOptions, function (err, _) {
        if (err) {
          console.log("Failed to send mail: ", err);
        } else {
          console.log(`Reminder sent to ${license.email}`);
        }
      });
    }
  });
}

async function worker() {
  while (true) {
    await sendMails();
    await delay(10 * 1000); // 10 seconds
  }
}

worker();
