const jwt = require("jsonwebtoken");

// Middleware to check roles
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).send("Access denied.");

    try {
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      if (!roles.includes(decoded.role)) {
        return res
          .status(403)
          .send(
            "Access denied. You do not have permission to access this resource."
          );
      }
      req.user = decoded;
      next();
    } catch (error) {
      res.status(400).send("Invalid token.");
    }
  };
};

module.exports = roleMiddleware;
