const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");
 
const connectDB = async () => {
  try {
    const dns = require("dns");
   dns.setServers(["8.8.8.8", "8.8.4.4"]);

    
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
 
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });
 
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });
 
    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};
 
module.exports = connectDB;
 