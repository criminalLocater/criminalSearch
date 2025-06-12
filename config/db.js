const mongoose = require("mongoose");

class DBconnection {
  async connectDB() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Databse Connected Successfully");
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new DBconnection();
