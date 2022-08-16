const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class userService {
    async getAllUsers(){
        try {
            const allUsers = await prisma.usuario.findMany()
            return allUsers;
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async createUser(userInfo){
        try {
            const { nombreUsuario, password, mail, nombre, apellido, edad } = userInfo

            const newUser = await prisma.usuario.create({
                data: {
                    nombreUsuario,
                    password,
                    mail,
                    nombre,
                    apellido,
                    edad
                }
            })

            return newUser
        } 
        catch (err) {
            console.error(err.message);
        }
    }

    async updatePassword(userInfo){
        try {
            const { nombreUsuario, password, nuevaPassword } = userInfo

            const user = await prisma.usuario.update({
                where: {
                    nombreUsuario: nombreUsuario,
                    password: password
                },
                data: {
                    password: nuevaPassword
                }
            })
            return user
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async deleteUser(userInfo){
        try {
            const { nombreUsuario, password } = userInfo

            const user = await prisma.usuario.delete({
                where: {
                    nombreUsuario: nombreUsuario,
                    password: password
                }
            })
            return user
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async getUser(userInfo){
        try {
            const { nombreUsuario, password } = userInfo

            const user = await prisma.usuario.findFirst({
                where: {
                    nombreUsuario: nombreUsuario,
                    password: password
                }
            })
            return user
        }
        catch (err) {
            console.error(err.message);
        }
    }
}

module.exports = new userService()