const PoliceStationModel = require("../models/station.model");
class StationRepository {
    async createStation(data) {
        try {
            let savedData = await PoliceStationModel.create(data);
            return savedData;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StationRepository();
