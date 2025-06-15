const Joi = require("joi");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

const signupSchema = Joi.object({
  fullName: Joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({
      "string.min": "Fullname must be at least 5 characters.",
      "string.max": "Fullname cannot exceed 30 characters.",
      "any.required": "Fullname is required.",
    }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),

  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      "any.required": "Password is required.",
    }),


  role: Joi.string()
    .valid("admin", "officer", "sic")
    .default("officer")
    .optional(),

  stationId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "stationId must be a valid MongoDB ObjectId.",
      "string.length": "stationId must be exactly 24 characters.",
      "any.required": "Station ID is required.",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be between 10 to 15 digits.",
      "any.required": "Phone number is required.",
    }),

  badgeNumber: Joi.string().optional(),

  rank: Joi.string()
    .required()
    .messages({
      "any.required": "Rank is required.",
    }),

  designation: Joi.string().optional(),

  joiningDate: Joi.date().optional(),

});
const signinSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
        .messages({
            'string.email': 'Email must be a valid email address.',
            'any.required': 'Email is required.'
        }),
    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Password must be at least 6 characters.',
            'any.required': 'Password is required.'
        }),
});
const updateUser = Joi.object({
  fullName: Joi.string()
    .min(5)
    .max(30)
    .required()
    .messages({
      "string.min": "Fullname must be at least 5 characters.",
      "string.max": "Fullname cannot exceed 30 characters.",
      "any.required": "Fullname is required.",
    }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),

  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      "any.required": "Password is required.",
    }),


  role: Joi.string()
    .valid("admin", "officer", "sic")
    .default("officer")
    .optional(),

  stationId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "stationId must be a valid MongoDB ObjectId.",
      "string.length": "stationId must be exactly 24 characters.",
      "any.required": "Station ID is required.",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be between 10 to 15 digits.",
      "any.required": "Phone number is required.",
    }),

  badgeNumber: Joi.string().optional(),

  rank: Joi.string()
    .required()
    .messages({
      "any.required": "Rank is required.",
    }),

  designation: Joi.string().optional(),

  joiningDate: Joi.date().optional(),

})
module.exports = {
    signupSchema,
    signinSchema
};