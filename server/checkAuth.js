const UserService = require('./services/user-service');

const checkAuth = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.user = await UserService.findOrCreateTestUser();
  }

  if (req.user) {
    next();
  } else {
    res.status(401).send('Unauthorized biatch');
  }
};

module.exports = checkAuth;
