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
            const data = await UserModel.findOne({email,isDeleted:false})
            return data
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();
