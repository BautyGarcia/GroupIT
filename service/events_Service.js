const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class eventService {

    async createEvent(eventInfo){
        try {
            const { nombre, descripcion, lugar, fecha, nombreUsuario } = eventInfo

            const newEvent = await prisma.eventos.create({
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
                },
                include: {
                    usuario: {
                        select: {
                            nombreUsuario: true
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
            const allEvents = await prisma.eventos.findMany({
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

    async getEventByUsername(eventInfo){
        try {
            const { nombreUsuario } = eventInfo

            const event = await prisma.eventos.findMany({
                where: {
                    usuario: {
                        nombreUsuario
                    }
                },
                include: {
                    usuario: {
                        select: {
                            nombreUsuario: true
                        }
                    }
                }
            })
            return event;
        }
        catch (err) {
            console.error(err.message)
        }
    }

    async updateEvent(eventInfo){
        try {
            const { nombre, descripcion, lugar, fecha, nombreUsuario } = eventInfo
            const newEvent = await prisma.eventos.update({
                where: {
                    nombre,
                    // usuario: {
                    //     nombreUsuario
                    // }
                    // Falta poner que tambien chequee el nombre de usuario
                },
                data: {
                    descripcion,
                    lugar,
                    fecha: new Date(fecha),
                    nombre
                },
                include: {
                    usuario: {
                        select: {
                            nombreUsuario: true
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
    
}

module.exports = new eventService()