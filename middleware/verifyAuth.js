const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const bearerToken = req.header('Authorization');
  if (!bearerToken) {
    return res.status(401).json({message: 'Access Denied'});
  }

  // Extract the actual token from the Bearer string
  const token = bearerToken.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({message: 'Invalid Token'});
  }
};
