const PoliceStationModel = require("../models/station.model");

class StationRepository {
    async createStation(data) {
        try {
            return await PoliceStationModel.create(data);
        } catch (error) {
            throw error;
        }
    }

    async getAllStations() {
        try {
            return await PoliceStationModel.aggregate([
                { $match: { isDeleted: false } },
                {
                    $lookup: {
                        from: "users",
                        let: {
                            pid: "$_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$isDeleted", false] },
                                            { $eq: ["$stationId", "$$pid"] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "userInfo",
                    },
                },
                {
                    $project: {
                        id: "$_id",
                        stationName: 1,
                        contactNumber: 1,
                        location: 1,
                        policeList: {
                            $map: {
                                input: "$userInfo",
                                as: "user",
                                in: {
                                    name: "$$user.fullName",
                                    email: "$$user.email",
                                    role: "$$user.role",
                                    rank: "$$user.rank",
                                    designation: "$$user.designation",
                                    joiningDate: "$$user.joiningDate",
                                },
                            },
                        },
                        isActive: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        _id: 0,
                    },
                },
            ]);
        } catch (error) {
            throw error;
        }
    }

    async getStationById(id) {
        try {
            return await PoliceStationModel.findOne({
                _id: id,
                isDeleted: false,
            });
        } catch (error) {
            throw error;
        }
    }

    async updateStation(id, updateData) {
        try {
            const updated = await PoliceStationModel.findOneAndUpdate(
                { _id: id, isDeleted: false },
                updateData,
                { new: true }
            );
            return updated;
        } catch (error) {
            throw error;
        }
    }

    async deleteStation(id) {
        try {
            const deleted = await PoliceStationModel.findOneAndUpdate(
                { _id: id, isDeleted: false },
                { isDeleted: true },
                { new: true }
            );
            return deleted;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StationRepository();
