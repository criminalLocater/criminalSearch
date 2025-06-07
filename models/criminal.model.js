const mongoose = require('mongoose');

const criminalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  crimeType: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  caseReference: [
    {
      caseNo: {
        type: String,
        required: true
      },
      section: {
        type: String,
        required: true
      }
    }
  ],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Jail', 'Bail'],
    default: 'Bail'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

criminalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Criminal', criminalSchema);
