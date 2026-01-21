const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected:', conn.connection.host);
    return conn;
  } catch (error) {
    console.warn('MongoDB Connection Warning:', error.message);
    console.warn('⚠️  Running in mock mode - install MongoDB to persist data');
    console.warn('Download MongoDB: https://www.mongodb.com/try/download/community');
    // Don't exit, continue in mock mode
    return null;
  }
};

module.exports = connectDB;
