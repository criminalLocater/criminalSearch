const mongoose = require('mongoose');

class DBconnection{
    connectDB(){
        mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB");
        
    }
}
module.exports = new DBconnection();