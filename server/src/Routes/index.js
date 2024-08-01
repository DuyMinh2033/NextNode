const UserRouter = require("./UserRouter");
const TestRouter = require("./TestRouter");
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/test", TestRouter);
};

module.exports = routes;
