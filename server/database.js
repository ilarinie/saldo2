const mongoose = require('mongoose');

const connectToDatabase = async (databaseURI) => {
  return mongoose.connect(databaseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectToDatabase;
