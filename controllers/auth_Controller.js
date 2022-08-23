const auth_Service = require('../service/auth_Service');

class authController {
    login(userInfo){
        return auth_Service.login(userInfo)
    }
}

module.exports = new authController()
