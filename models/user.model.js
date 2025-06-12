const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        trim: true 
    },
    email : {
        type: String,
        unique: true,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    role : {
        type : String,
        enum : ['admin','officer','station_head'],
        //  admin - admin could be a senior officer or IT admin.
        //  officer - Investigating Officer / Field Officer
        //  station_head - Station Incharge / SHO - Station House Officer
        default : 'officer'
    },
    stationId : {
        type : String,
        required : true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const UserModel = new mongoose.model('user',UserSchema)
module.exports = UserModel