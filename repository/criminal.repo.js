const criminalModel = require("../models/criminal.model");

class CriminalRepository {
    async createCriminal(criminalData) {
        try {
            return await criminalModel.create(criminalData);
        } catch (error) {
            console.error("Error creating criminal:", error.message);
            throw error;
        }
    }

    async getAllCriminals(page, limit) {
        try {
            const options = {
                page,
                limit,
            };

            const data = await criminalModel.aggregatePaginate([
                { $match: { isDeleted: false } },
                { $unwind: "$caseReference" },
                {
                    $project: {
                        name: 1,
                        age: 1,
                        crimeType: 1,
                        address: 1,
                        location: 1,
                        status: 1,
                        caseNo: "$caseReference.caseNo",
                        section: "$caseReference.section",
                    },
                },
            ],options);
            return {
                total: data.totalDocs,
                page: data.page,
                limit: data.limit,
                totalPages: data.totalPages,
                users: data.docs,
            };
        } catch (error) {
            console.error("Error fetching criminals:", error.message);
            throw error;
        }
    }

    async getCriminalById(id) {
        try {
            return await criminalModel.findOne({ _id: id, isDeleted: false });
        } catch (error) {
            console.error("Error fetching criminal by ID:", error.message);
            throw error;
        }
    }

    async updateCriminal(id, updateData) {
        try {
            return await criminalModel.findByIdAndUpdate(id, updateData, {
                new: true,
            });
        } catch (error) {
            console.error("Error updating criminal:", error.message);
            throw error;
        }
    }

    async deleteCriminal(id) {
        try {
            return await criminalModel.findByIdAndUpdate(
                id,
                { isDeleted: true },
                { new: true }
            );
        } catch (error) {
            console.error("Error deleting criminal:", error.message);
            throw error;
        }
    }

    async getCriminalsByLocation({
        lat,
        lng,
        radius = 5000,
        page = 1,
        limit = 10,
    }) {
        try {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const coordinates = [parseFloat(lng), parseFloat(lat)];

            return await criminalModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: coordinates,
                        },
                        distanceField: "dist.calculated",
                        maxDistance: parseFloat(radius),
                        spherical: true,
                        query: { isDeleted: false },
                    },
                },
                { $unwind: "$caseReference" },
                {
                    $project: {
                        name: 1,
                        age: 1,
                        crimeType: 1,
                        address: 1,
                        location: 1,
                        status: 1,
                        distance: { $round: ["$dist.calculated", 0] },
                        caseNo: "$caseReference.caseNo",
                        section: "$caseReference.section",
                    },
                },
                { $skip: skip },
                { $limit: parseInt(limit) },
            ]);
        } catch (error) {
            console.error(
                "Error fetching criminals by location:",
                error.message
            );
            throw error;
        }
    }
}

module.exports = new CriminalRepository();
