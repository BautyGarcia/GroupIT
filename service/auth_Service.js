const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');


class authService {
    async login(userInfo){
        try {
            const { nombreUsuario, password} = userInfo

            const user = await prisma.usuario.findFirst({
                where: {
                    nombreUsuario
                }
            })

            if(!user){
                throw new Error("Wrong username")
            }

            const matches = bcrypt.compareSync(password, user.password)

            if(!matches){
                throw new Error("Wrong password")
            }

            return user
        }
        catch (err) {
            console.error(err.message);
        }
    }
}

module.exports = new authService();