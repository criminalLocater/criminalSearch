const UserModel = require("../models/user.model");
class UserRepository {
    async createUser(data) {
        try {
            let savedData = await UserModel.create(data);
            return savedData;
        } catch (error) {
            throw error;
        }
    }
    async emailExists(email) {
        try {
            const data = await UserModel.findOne({ email, isDeleted: false });
            return data;
        } catch (error) {
            throw error;
        }
    }
    async getAllUser(page = 1,limit =5) {
        try {
            const options = {
                page,
                limit
            }
            const data = await UserModel.aggregatePaginate([
                { $match: { isDeleted: false } },
                {
                    $lookup : {
                        from : "stations",
                        let :{
                            userId : "$stationId"
                        },
                        pipeline : [
                            {
                                $match :{
                                    $expr : {
                                        $and :[
                                            {$eq : ["$isDeleted",false]},
                                            {$eq : ["$_id","$$userId"]}
                                        ]
                                    }
                                }
                            }
                        ],
                        as : "policeStation",
                    }
                },
                {$unwind : "$policeStation"},
                {
                    $project: {
                        id: "$_id",
                        fullName: 1,
                        email: 1,
                        role: 1,
                        stationId: "$policeStation.stationName",
                        badgeNumber: 1,
                        rank: 1,
                        designation: 1,
                        joiningDate: 1,
                        photo: 1,
                        _id: 1,
                    },
                },
            ],options);
            return {
                total : data.totalDocs,
                page : data.page,
                limit : data.limit,
                totalPages : data.totalPages,
                users : data.docs,

            };
        } catch (error) {
            throw error;
        }
    }
    async getSpecificUser(userId) {
        try {
            const data = await UserModel.findById({ _id: userId }).select(
                "-password -isDeleted -createdAt -updatedAt -isVerify -isAdminDeleted -admin_msg -isActive"
            );
            return data;
        } catch (error) {
            throw error;
        }
    }
    async updateUser(userId, data) {
        try {
            const updatedData = await UserModel.updateOne(
                { _id: userId, isDeleted: false },
                data,
                { new: true }
            );
            // .select(
            //     "-isDeleted -createdAt -updatedAt -isVerify -isAdminDeleted -admin_msg -isActive"
            // );
            return updatedData;
        } catch (error) {
            throw error;
        }
    }
    async deleteUser(userId) {
        try {
            const data = await UserModel.updateOne(
                { _id: userId, isDeleted: false },
                { $set: { isDeleted: true } },
                { new: true }
            ).select(
                "-password -createdAt -updatedAt -isVerify -isAdminDeleted -admin_msg -isActive"
            );
            return data;
        } catch (error) {
            throw error;
        }
    }
    // user.repository.js

async forgotPassword(email) {
    const user = await UserModel.findOne({ email });
    console.log("Fetched user:", user); // ✅ Add this
    return user; // Return only the user object
}

async updatePassword(userId, hashedPassword) {
    return await UserModel.updateOne(
        { _id: userId, isDeleted: false },
        { $set: { password: hashedPassword } }
    );
}
async changePassword(userId, hashedPassword) {
    return await UserModel.updateOne(
        { _id: userId, isDeleted: false },
        { $set: { password: hashedPassword } }
    );
}
}

module.exports = new UserRepository();
