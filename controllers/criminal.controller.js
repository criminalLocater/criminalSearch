const criminalRepo = require("../repository/criminal.repo");

class CriminalController {
    async createCriminal(req, res) {
        try {
            let criminalData = { ...req.body };

            // Parse location if it's a string
            if (criminalData.location) {
                try {
                    criminalData.location = JSON.parse(criminalData.location);
                } catch (e) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Invalid location format. Must be a valid GeoJSON.",
                    });
                }
            }

            // Set uploaded photo path
            if (req.file) {
                criminalData.photo = `http://127.0.0.1:3000/uploads/${req.file.filename}`;
            }

            const criminal = await criminalRepo.createCriminal(criminalData);

            res.status(201).json({
                success: true,
                message: "Criminal created successfully",
                data: criminal,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to create criminal",
                error: err.message,
            });
        }
    }

    async getAllCriminals(req, res) {
        try {
            const criminals = await criminalRepo.getAllCriminals();
            res.status(200).json({
                success: true,
                message: "All criminals fetched successfully",
                data: criminals,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to fetch criminals",
                error: err.message,
            });
        }
    }

    async getCriminalById(req, res) {
        try {
            const { id } = req.params;
            const criminal = await criminalRepo.getCriminalById(id);

            if (!criminal) {
                return res.status(404).json({
                    success: false,
                    message: "Criminal not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Criminal fetched successfully",
                data: criminal,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to fetch criminal by ID",
                error: err.message,
            });
        }
    }
    async updateCriminal(req, res) {
        try {
            const { id } = req.params;
            let updateData = { ...req.body };

            // ✅ Always parse location if it's a string
            if (
                updateData.location &&
                typeof updateData.location === "string"
            ) {
                try {
                    updateData.location = JSON.parse(updateData.location);
                } catch (e) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Invalid location format. Must be valid GeoJSON.",
                    });
                }
            }
            if (req.file) {
                updateData.photo = `http://127.0.0.1:3000/uploads/${req.file.filename}`;
            }

            const updatedCriminal = await criminalRepo.updateCriminal(
                id,
                updateData
            );

            if (!updatedCriminal) {
                return res.status(404).json({
                    success: false,
                    message: "Criminal not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Criminal updated successfully",
                data: updatedCriminal,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to update criminal",
                error: err.message,
            });
        }
    }

    async deleteCriminal(req, res) {
        try {
            const { id } = req.params;
            const deleted = await criminalRepo.deleteCriminal(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Criminal not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Criminal soft-deleted successfully",
                data: deleted,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to delete criminal",
                error: err.message,
            });
        }
    }

    async getCriminalsByLocation(req, res) {
        try {
            const { lat, lng, radius, page, limit } = req.query;

            if (!lat || !lng) {
                return res.status(400).json({
                    success: false,
                    message: "Latitude and Longitude are required",
                });
            }

            const criminals = await criminalRepo.getCriminalsByLocation({
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                radius: parseInt(radius) || 5000, // default 5 km
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
            });

            if (!criminals.length) {
                return res.status(404).json({
                    success: false,
                    message: "No criminals found nearby",
                    data: [],
                });
            }

            res.status(200).json({
                success: true,
                message: "Nearby criminals fetched successfully",
                data: criminals,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Failed to fetch nearby criminals",
                error: err.message,
            });
        }
    }
}

module.exports = new CriminalController();
