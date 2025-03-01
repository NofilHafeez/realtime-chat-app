const mongoose = require('mongoose');
const {MONGO_URI} = require('./keys');

const connectDB = async () => {
  try {
    let dbURI;

    if (process.env.NODE_ENV === 'production') {
      dbURI = MONGO_URI// Use production DB URI from .env.production
    } else {
      dbURI = MONGO_URI// Use development DB URI from .env
    }
    console.log('Attempting to connect to the database...',dbURI);

    mongoose
    .connect(dbURI)
    .then((conn) => console.log(`Connected to MongoDB at ${conn.connection.host}`))
    .catch((err) => {
      console.error(`Error connecting to MongoDB: ${err.message}`);
      process.exit(1); // Exit process with failure
    });
  
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
