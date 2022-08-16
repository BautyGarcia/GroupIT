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
            const { nombreUsuario, password, mail, nombre, apellido, edad } = userInfo

            const newUser = await prisma.Usuario.create({
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

            const user = await prisma.Usuario.update({
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

            const user = await prisma.Usuario.delete({
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

            const user = await prisma.Usuario.findFirst({
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

    

    async createEvent(eventInfo){
        try {
            const { nombre, descripcion, lugar, fecha, nombreUsuario } = eventInfo
            
            const userHost = await prisma.Usuario.findFirst({
                where: {
                    nombreUsuario: nombreUsuario
                }
            })

            const newEvent = await prisma.Eventos.create({
                data: {
                    nombre,
                    descripcion,
                    lugar,
                    fecha: new Date(fecha),
                    usuario: {
                        connect: {
                            nombreUsuario
                        }
                    }
                }
            })

            return newEvent
        } 
        catch (err) {
            console.error(err.message);
        }
    }

    async getAllEvents(){
        try {
            const allEvents = await prisma.Eventos.findMany({
               include: {
                    usuario: {
                        select: {
                            nombreUsuario: true
                        }
                    }
                }
            })
            return allEvents;
        }
        catch (err) {
            console.error(err.message);
        }
    }
    
}

module.exports = new GroupITService()