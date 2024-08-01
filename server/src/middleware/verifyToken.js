const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      status: "Error",
      message: "Thiếu authorization",
    });
  }
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(401).json({ message: "Token is not valid!" });
    req.userId = payload.id;
    next();
  });
};
module.exports = verifyToken;
