const express = require("express");
const app = express();
require("dotenv").config();
const routes = require("./src/Routes/index");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOption = {
  origin: [process.env.PORT_NEXT],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"], // fix bug lỗi cors ERR_NETWORK
};
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
routes(app);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server running at port ${port}!`);
});
