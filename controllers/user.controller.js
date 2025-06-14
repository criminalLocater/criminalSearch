const UserRepository = require("../repository/user.repo");
const UserModel = require("../models/user.model");

const jwt = require("jsonwebtoken");
const { signupSchema, signinSchema } = require("../validator/user.validator");
const Mailer = require("../helper/mailer");
class UserController {
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
                fullname,
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
            const newUser = await UserRepository.createUser({
                fullname,
                email,
                password: hashedPassword,
                role,
                stationId,
                phone,
                badgeNumber,
                rank,
                designation,
                joiningDate,
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
                );

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
}

module.exports = new UserController();
