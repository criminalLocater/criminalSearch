const router = require("express").Router();
const StationController = require("../controllers/station.controller");
const authCheck = require("../middlewares/auth")();
const authorizeRoles = require('../middlewares/role')

// Only Admin and Station Heads can manage police stations
router.post(
    "/create-station",
    authCheck.authenticateAPI,
    authorizeRoles("admin"),
    StationController.createPoliceStation
);
router.get(
    "/all-stations",
    authCheck.authenticateAPI,
    StationController.getAllStations
); // All roles can view
router.get("/edit/:id", authCheck.authenticateAPI, StationController.getStationById); // All roles can view
router.put("/update/:id", authCheck.authenticateAPI, StationController.updateStation);
router.delete(
    "/delete/:id",
    authCheck.authenticateAPI,
    StationController.deleteStation
);
module.exports = router;
