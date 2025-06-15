const passport = require("passport");
const passportJWT = require("passport-jwt");

const UserModel = require("../models/user.model");

const ExtractJWT = passportJWT.ExtractJwt;

const params = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJWT.fromExtractors([
        ExtractJWT.fromHeader("x-access-token"),
        ExtractJWT.fromHeader("token"),
    ]),
};
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy;
module.exports = () => {
    const strategy = new JwtStrategy(params, async (payload, done) => {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(payload.id),
                    isDeleted: false,
                },
            },
        ]).exec();
        if (user) {
            return done(null, user[0]);
        } else {
            return done(null, false); // User not found
        }
    });
    passport.use(strategy);
    return {
        initialize: () => {
            return passport.initialize();
        },
        // This is for admin panel jwt token check
        authenticateAPI: (req, res, next) => {
            passport.authenticate(
                "jwt",
                process.env.JWT_SECRET,
                (err, user) => {
                    if (err) {
                        return res.send({
                            status: 500,
                            message:
                                "Please provide a vaid token ,your token might be expired",
                        });
                    }
                    if (!user) {
                        return res.send({
                            status: 401,
                            message: "Sorry user not found!",
                        });
                    }
                    req.user = user;
                    return next();
                }
            )(req, res, next);
        },
    };
};
