const UserRepository = require("../repository/user.repo");
const UserModel = require("../models/user.model");

const jwt = require("jsonwebtoken");
const { signupSchema, signinSchema } = require("../validator/user.validator");
// const { createStationSchema } = require("../validator/station.validator");
const Mailer = require("../helper/mailer");
class UserController {
    // registration
    async signup(req, res) {
        try {
            const { error, value } = signupSchema.validate(req.body, {
                abortEarly: false,
            });
            if (error) {
                const message = error.details.map((detail) => detail.message);
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: message,
                });
            }
            const {
                fullName,
                email,
                password,
                role,
                stationId,
                phone,
                badgeNumber,
                rank,
                designation,
                joiningDate,
            } = value;
            // Check if email exists

            const isEmailExists = await UserRepository.emailExists(email);
            if (isEmailExists) {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Email is already exists",
                });
            }
            const hashedPassword = await new UserModel().generateHash(password);
            // Add photo path if uploaded
        let photoPath = "";
        if (req.file) {
            photoPath = `http://127.0.0.1:3000/uploads/${req.file.filename}`;
        }
            const newUser = await UserRepository.createUser({
                fullName,
                email,
                password: hashedPassword,
                role,
                stationId,
                phone,
                badgeNumber,
                rank,
                designation,
                joiningDate,
                photo: photoPath,
            });
            if (newUser) {
                const mailer = new Mailer(
                    "Gmail",
                    process.env.APP_EMAIL,
                    process.env.APP_PASSWORD
                );
                const mailObj = {
                    to: email,
                    subject: "Registration Confirmation",
                    text: `You have successfully register with us with ${email} email id and password is ${req.body.password}. Thank You!!!`,
                };
                mailer.sendMail(mailObj);
                const userWithoutSensitiveData = await UserModel.findById(
                    newUser._id
                ).select("-password");

                return res.status(200).json({
                    status: 200,
                    message: "Registration successfully completed!",
                    data: userWithoutSensitiveData,
                });
            } else {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Something went wrong during registration",
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                status: 500,
                data: {},
                message: error.message || error,
            });
        }
    }
    // login
    async signin(req, res) {
        try {
            const { error, value } = signinSchema.validate(req.body, {
                abortEarly: false,
            });
            if (error) {
                const messages = error.details.map((detail) => detail.message);
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: messages,
                });
            }
            const { email, password } = value;
            const userEmail = email.trim().toLowerCase();
            const user = await UserModel.findOne({
                email: userEmail,
                isDeleted: false,
            });

            if (!user) {
                return res.status(401).send({
                    status: 401,
                    data: {},
                    message: "Authentication failed. Invalid credentials.",
                });
            }
            const isPasswordValid = await new UserModel().validPassword(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return res.status(401).send({
                    status: 401,
                    data: {},
                    message: "Authentication failed. Invalid credentials.",
                });
            }
            const payload = { id: user._id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1D",
            });

            const userWithoutSensitiveData = await UserModel.findById(
                user._id
            ).select("-password -_id -isDeleted -createdAt -updatedAt");

            return res.status(200).send({
                status: 200,
                data: userWithoutSensitiveData,
                token,
                message: "Signin successfully completed!",
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                data: {},
                message: error.message || error,
            });
        }
    }
    // get all user
    async getAllUser(req, res) {
        try {
            const allData = await UserRepository.getAllUser();
            if (allData) {
                return res.status(201).send({
                    status: 201,
                    data: allData,
                    message: "Data fetched successfully",
                });
            } else {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Data failed to fetched",
                });
            }
        } catch (error) {
            return res.status(500).send({
                status: 500,
                data: {},
                message: `error is ${error}`,
            });
        }
    }
    // get specific user
    async getSpecificUser(req, res) {
        try {
            const { id } = req.params;
            const data = await UserRepository.getSpecificUser(id);
            if (data) {
                return res.status(201).send({
                    status: 201,
                    data: data,
                    message: "Data fetched successfully",
                });
            } else {
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Data failed to fetched",
                });
            }
        } catch (error) {
            return res.status(500).send({
                status: 500,
                data: {},
                message: `error is ${error}`,
            });
        }
    }
    // update user
    async updateUser(req, res) {
        try {
            const { error, value } = signupSchema.validate(req.body, {
                abortEarly: false,
            });
            if (error) {
                const message = error.details.map((detail) => detail.message);
                return res.status(400).send({
                    status: 400,
                    data: {},
                    message: message,
                });
            }

            const { id } = req.params;

            // Find the existing user
            const existingUser = await UserRepository.getSpecificUser(id);
            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }

            // Build updated data object dynamically
            const updateData = {
                fullName: value.fullName || existingUser.fullName,
                email: value.email || existingUser.email,
                phone: value.phone || existingUser.phone,
                badgeNumber: value.badgeNumber || existingUser.badgeNumber,
                rank: value.rank || existingUser.rank,
                designation: value.designation || existingUser.designation,
                joiningDate: value.joiningDate || existingUser.joiningDate,
                role: value.role || existingUser.role,
                stationId: value.stationId || existingUser.stationId,
            };
            console.log(updateData);
            

            // Only hash and update password if provided
            if (value.password) {
                updateData.password = await new UserModel().generateHash(
                    value.password
                );
            }
            // Update photo if uploaded
            if (req.file) {
            updateData.photo = `http://127.0.0.1:3000/uploads/${req.file.filename}`;
        }
            // Pass to repository for update
            const updatedUser = await UserRepository.updateUser(id, updateData);

            if (!updatedUser) {
                return res.status(500).send({
                    status: 500,
                    data: {},
                    message: "Failed to update user",
                });
            }

            // Remove sensitive fields before sending response
            const userWithoutSensitiveData = await UserModel.findById(
                id
            ).select("-password -_id -isDeleted -createdAt -updatedAt");

            return res.status(200).json({
                status: 200,
                data: userWithoutSensitiveData,
                message: "User updated successfully!",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                status: 500,
                data: {},
                message: "Internal server error",
            });
        }
    } // delete user
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            let deletedData = await UserRepository.deleteUser(id);
            if (deletedData) {
                return res.json({
                    status: 200,
                    message: "data deleted successfully",
                    data: { id },
                });
            } else {
                return res.json({
                    status: 400,
                    message: "data failed to delete ",
                    data: {},
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                status: 500,
                data: {},
                message: "Internal server error",
            });
        }
    }
    // create police station
    async createPoliceStation(req, res) {
        // const { error, value } = createStationSchema.validate(req.body, {
        //     abortEarly: false,
        // });

        // if (error) {
        //     const messages = error.details.map((detail) => detail.message);
        //     return res.status(400).json({
        //         status: 400,
        //         message: "Validation failed",
        //         errors: messages,
        //     });
        // }

        try {
            // const {stationName,location,contactNumber} = req.body
            // const {type,coordinates} = location

            const { stationName, location, contactNumber } = req.body;

        // Optional: Validate presence of required fields
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
}

module.exports = new UserController();
