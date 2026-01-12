const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid Authorization header format' });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // support both { userId } and older { id }
    req.userId = decoded.userId || decoded.id || decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
