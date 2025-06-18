const PoliceStationModel = require('../models/station.model');

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
      return await PoliceStationModel.find({ isDeleted: false });
    } catch (error) {
      throw error;
    }
  }

  async getStationById(id) {
    try {
      return await PoliceStationModel.findOne({ _id: id, isDeleted: false });
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