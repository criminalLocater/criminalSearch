// station.controller.js
const StationRepository = require('../repository/station.repo');

class StationController {
  // CREATE
  async createPoliceStation(req, res) {
    try {
      const { stationName, location, contactNumber } = req.body;

      if (!stationName || !location || !contactNumber) {
        return res.status(400).json({
          status: 400,
          message: "Missing required fields",
        });
      }

      // Ensure coordinates are numbers
      if (location.coordinates && Array.isArray(location.coordinates)) {
        location.coordinates = location.coordinates.map(Number);
      }

      const newStation = await StationRepository.createStation(req.body);

      return res.status(201).json({
        status: 201,
        message: "Station created successfully",
        data: newStation,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  // READ ALL
  async getAllStations(req, res) {
    try {
      const {page=1,limit=5}= req.query
      const stations = await StationRepository.getAllStations(page,limit);
      console.log("stations ",stations);
      
      return res.status(200).json({
        status: 200,
        message: "All stations fetched successfully",
        data: stations,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  // READ BY ID
  async getStationById(req, res) {
    try {
      const { id } = req.params;
      const station = await StationRepository.getStationById(id);

      if (!station) {
        return res.status(404).json({
          status: 404,
          message: "Station not found",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Station fetched successfully",
        data: station,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  // UPDATE
  async updateStation(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (updateData.location?.coordinates) {
        updateData.location.coordinates = updateData.location.coordinates.map(Number);
      }

      const updatedStation = await StationRepository.updateStation(id, updateData);

      if (!updatedStation) {
        return res.status(404).json({
          status: 404,
          message: "Station not found",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Station updated successfully",
        data: updatedStation,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }

  // DELETE (Soft)
  async deleteStation(req, res) {
    try {
      const { id } = req.params;
      const deletedStation = await StationRepository.deleteStation(id);

      if (!deletedStation) {
        return res.status(404).json({
          status: 404,
          message: "Station not found",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Station soft-deleted successfully",
        data: deletedStation,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new StationController();