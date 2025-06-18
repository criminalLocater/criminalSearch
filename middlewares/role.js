
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Assume req.user is set by auth middleware
    const user = req.user;

    if (!user || !user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
    }

    const userRole = user.role;
console.log(userRole);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't have permission to access this resource",
      });
    }

    // Role is authorized
    next();
  };
};

module.exports = authorizeRoles;