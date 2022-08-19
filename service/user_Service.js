const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');

class userService {

    async getAllUsers(){
        try {
            const allUsers = await prisma.usuario.findMany()
            return allUsers;
        }
        catch (err) {
            console.error(err.message);
            throw err
        }
    }

    async createUser(userInfo){
        try {
            const { nombreUsuario, password, mail, nombre, apellido, edad } = userInfo

            const hashedPassword = bcrypt.hashSync(password, 10)

            const newUser = await prisma.usuario.create({
                data: {
                    nombreUsuario,
                    password: hashedPassword,
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

    async login(userInfo){
        try {
            const { nombreUsuario, password} = userInfo

            const user = await prisma.usuario.findFirst({
                where: {
                    nombreUsuario
                }
            })

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

module.exports = new userService()