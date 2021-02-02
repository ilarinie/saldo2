const checkAuth = (req, res, next) => {
  const token = req.header('Authorization');
  if (token === process.env.SECRET) {
    next();
  } else {
    res.status(401).send('Unauthorized biatch');
  }
};

module.exports = checkAuth;
