const GroupIT_Service = require('../service/groupit_Service');

class GroupITController {

    getAllUsers(){
        return GroupIT_Service.getAllUsers()
    }

    createUser(userInfo){
        return GroupIT_Service.createUser(userInfo)
    }
}

module.exports = new GroupITController()