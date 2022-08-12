const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class GroupITService {

    async getAllUsers(){
        try {
            const allUsers = await prisma.Usuario.findMany()
            return allUsers;
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async createUser(userInfo){
        try {
            const newUser = await prisma.Usuario.create({
                data: {
                    nombreUsuario: userInfo.nombreUsuario,
                    password: userInfo.password,
                    mail: userInfo.mail,
                    nombre: userInfo.nombre,
                    apellido: userInfo.apellido,
                    edad: userInfo.edad
                }
            })

            return newUser
        } 
        catch (err) {
            console.error(err.message);
        }
    }
}

module.exports = new GroupITService()