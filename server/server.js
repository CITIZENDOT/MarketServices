require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT || 8000;

app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("tiny"));
app.use("/user", require("./routes/user"));
app.use("/shop", require("./routes/shop"));
app.use("/gatepass", require("./routes/gatepass"));
app.use("/license", require("./routes/license"));
app.use("/feedback", require("./routes/feedback"));

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
