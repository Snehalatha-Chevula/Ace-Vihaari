const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  console.log("in authenticate");
  const token = req.cookies.accessToken;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userID, role }
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

module.exports = authenticate;
