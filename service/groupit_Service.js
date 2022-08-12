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

    async updatePassword(userInfo){
        try {
            const user = await prisma.Usuario.update({
                where: {
                    nombreUsuario: userInfo.nombreUsuario,
                    password: userInfo.password
                },
                data: {
                    password: userInfo.nuevaPassword
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
            const user = await prisma.Usuario.delete({
                where: {
                    nombreUsuario: userInfo.nombreUsuario,
                    password: userInfo.password
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
            const user = await prisma.Usuario.findOne({
                where: {
                    nombreUsuario: userInfo.nombreUsuario,
                    password: userInfo.password
                }
            })
            return user
        }
        catch (err) {
            console.error(err.message);
        }
    }
}

module.exports = new GroupITService()