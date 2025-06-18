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
    async getAllUser() {
        try {
            const data = await UserModel.find({ isDeleted: false }).select(
                "-password -createdAt -updatedAt -isVerify -isAdminDeleted -admin_msg -isActive"
            );
            return data;
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
                data ,
                { new: true }
            )
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
            const data = await UserModel.updateOne({ _id: userId,isDeleted : true })
            // .select(
            //     "-password -createdAt -updatedAt -isVerify -isAdminDeleted -admin_msg -isActive"
            // );
            return data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();
