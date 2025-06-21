const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            enum: ["admin", "officer", "sic", "deo"],
            //  admin - admin could be a senior officer or IT admin.
            //  officer - Investigating Officer / Field Officer
            //  sic(station incharge) - Station Incharge / SHO - Station House Officer
            //  deo - data entry operator or Desk officer or front-desk staff
            //        May be a clerk or junior officer , Junior Constable

            default: "officer",
        },
        stationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "station",
            // required: [true, "Station Name is Required"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        badgeNumber: {
            type: String,
        },
        rank: {
            type: String,
            required: [true, "Rank is required"],
        },
        designation: {
            type: String,
        },
        joiningDate: {
            type: Date,
        },
        photo: {
            type: String,
            default: "",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isAdminDeleted: {
            type: Boolean,
            default: false,
        },
        admin_msg: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// generating a hash password

UserSchema.methods.generateHash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// checking if password is valid
UserSchema.methods.validPassword = async (password, checkPassword) => {
    return bcrypt.compareSync(password, checkPassword);
};

const UserModel = new mongoose.model("user", UserSchema);

module.exports = UserModel;
