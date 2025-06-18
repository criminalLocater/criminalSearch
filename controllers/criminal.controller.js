const criminalRepo = require('../repository/criminal.repo');

class CriminalController {
  async createCriminal(req, res) {
  try {
    const criminalData = req.body;
    // Set uploaded photo paths
    criminalData.photos = req.files.map(file => `/uploads/${file.filename}`);
    const criminal = await criminalRepo.createCriminal(criminalData);
    res.status(201).json({
      success: true,
      message: 'Criminal created successfully',
      data: criminal,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create criminal',
      error: err.message,
    });
  }
}

  async getAllCriminals(req, res) {
    try {
      const criminals = await criminalRepo.getAllCriminals();
      res.status(200).json({
        success: true,
        message: 'All criminals fetched successfully',
        data: criminals,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch criminals',
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
          message: 'Criminal not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Criminal fetched successfully',
        data: criminal,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch criminal by ID',
        error: err.message,
      });
    }
  }
  async updateCriminal(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (req.files && req.files.length > 0) {
      updateData.photos = req.files.map(file => `/uploads/${file.filename}`);
    }
    const updatedCriminal = await criminalRepo.updateCriminal(id, updateData);
    if (!updatedCriminal) {
      return res.status(404).json({
        success: false,
        message: 'Criminal not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Criminal updated successfully',
      data: updatedCriminal,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update criminal',
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
          message: 'Criminal not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Criminal soft-deleted successfully',
        data: deleted,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete criminal',
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
          message: 'Latitude and Longitude are required',
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
          message: 'No criminals found nearby',
          data: [],
        });
      }

      res.status(200).json({
        success: true,
        message: 'Nearby criminals fetched successfully',
        data: criminals,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch nearby criminals',
        error: err.message,
      });
    }
  }
}

module.exports = new CriminalController();