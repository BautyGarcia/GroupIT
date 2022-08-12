const GroupIT_Service = require('../service/groupit_Service');

class GroupITController {

    getAllUsers(){
        return GroupIT_Service.getAllUsers()
    }

    createUser(userInfo){
        return GroupIT_Service.createUser(userInfo)
    }

    updatePassword(userInfo){
        return GroupIT_Service.updatePassword(userInfo)
    }

    deleteUser(userInfo){
        return GroupIT_Service.deleteUser(userInfo)
    }
    
    getUser(userInfo){
        return GroupIT_Service.getUser(userInfo)
    }   
}

module.exports = new GroupITController()