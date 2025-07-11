const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

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
  photo: {
    type: String,
    required: true
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
criminalSchema.plugin(aggregatePaginate)

module.exports = mongoose.model('Criminal', criminalSchema);
