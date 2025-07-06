const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    versionKey: false
});
contactSchema.plugin(aggregatePaginate)


module.exports = mongoose.model('Contact', contactSchema);