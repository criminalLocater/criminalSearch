const mongoose = require("mongoose");

const PoliceStationSchema = new mongoose.Schema(
    {
        stationName: {
            type: String,
            required: [true, "Station Name is required"],
            trim: true,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },
        contactNumber: {
            type: String,
            required: [true, "Contact Number is required"],
            trim: true,
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
PoliceStationSchema.index({ location: "2dsphere" });

const PoliceStationModel = new mongoose.model("station", PoliceStationSchema);

module.exports = PoliceStationModel;
