const jwt = require("jsonwebtoken");

const shouldBeLogIn = async (req, res) => {
  console.log("data", req.userId);
  res.status(200).json({ message: "You are authenticated" });
};

const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;
  console.log("token", token);
  if (!token) return res.status(401).json({ message: "Not authenticated" });
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not valid!" });
    if (!payload.isAdmin)
      return res.status(403).json({ message: "You are't admin" });
    res.status(200).json({ message: "You are admin " });
  });
};

module.exports = {
  shouldBeLogIn,
  shouldBeAdmin,
};
