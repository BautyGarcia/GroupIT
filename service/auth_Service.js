const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const user_Service = require('../service/user_Service');

class authService {
    async login(userInfo){
    
        const { password } = userInfo
        
        const user = await user_Service.getUser(userInfo)
        
        const matches = bcrypt.compareSync(password, user.password)
        
        if(!user || !matches){
            throw new Error('Wrong credentials')
        }

        return user

    }
}

module.exports = new authService();