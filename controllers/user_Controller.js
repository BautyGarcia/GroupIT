const user_Service = require('../service/user_Service');

class userController {
    getAllUsers(){
        return user_Service.getAllUsers()
    }
    
    createUser(userInfo){
        return user_Service.createUser(userInfo)
    }
    
    updatePassword(userInfo){
        return user_Service.updatePassword(userInfo)
    }
    
    deleteUser(userInfo){
        return user_Service.deleteUser(userInfo)
    }

    sendEmail(userInfo){
        return user_Service.sendEmail(userInfo)
    }

    getEmail(userInfo){
        return user_Service.getEmail(userInfo)
    }
}

module.exports = new userController()