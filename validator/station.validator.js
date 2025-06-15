const Joi = require('joi');

// Schema for location sub-object
const locationSchema = Joi.object({
    type: Joi.string()
        .valid("Point")
        .required()
        .messages({
            "any.only": "Location type must be 'Point'",
            "string.empty": "Location type cannot be empty"
        }),
    coordinates: Joi.array()
        .items(Joi.number())
        .length(2)
        .required()
        .messages({
            "array.length": "Coordinates must contain exactly 2 values: [longitude, latitude]",
            "array.include": "Coordinates must be an array of numbers",
            "array.base": "Coordinates must be an array"
        })
});

// Main schema for station
const createStationSchema = Joi.object({
    stationName: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "Station name is required",
            "string.min": "Station name must be at least 3 characters",
            "string.max": "Station name must be less than 100 characters"
        }),
    location: Joi.object(locationSchema)
        .required()
        .messages({
            "object.base": "Location must be an object",
            "any.required": "Location is required"
        }),
    contactNumber: Joi.string()
        .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
        .required()
        .messages({
            "string.empty": "Contact number is required",
            "string.pattern.base": "Contact number is not valid"
        }),
});

module.exports = {
    createStationSchema
};