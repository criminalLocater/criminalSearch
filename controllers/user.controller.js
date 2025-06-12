const UserRepository = require("../repository/user.repo");
class UserController {
  async registration(req, res) {
    try {
      const { name, email, password, role, stationId } = req.body;
      const UserObj = {
        name,
        email,
        password,
        role,
        stationId
      }
      const data = await UserRepository.createUser(UserObj);
      if(data){
        return res.status(200).json({
            status : 200,
            message : "User Registered Successfully",
            data : data
        })
      }
      else{
        return res.status(400).json({
            status : 400,
            message : "Failed to registered",
        })
      }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status : 500,
            message : "Internal Server Error",
        })
        
    }
  }
}

module.exports = new UserController();
