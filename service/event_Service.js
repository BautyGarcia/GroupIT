const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class eventService {

    async createEvent(eventInfo) {
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

    async getAllEvents() {
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

    async getMyEvents(eventInfo) {
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

    async updateEvent(eventInfo) {
        try {

            const { nombre, descripcion, lugar, fecha, nombreUsuario } = eventInfo

            const event = await prisma.eventos.findFirst({
                where: {
                    nombre,
                    usuario: {
                        nombreUsuario
                    }
                }
            })

            if (!event) {
                throw new Error('User is not host of event')
            }
    
            const newEvent = await prisma.eventos.update({
                where: {
                    id: event.id
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
            console.error(err.message)
        }
    }

    async addUserToEvent(eventInfo) {
        try {
            const {nombreHost, nombreUsuario, nombreEvento } = eventInfo

            const event = await prisma.eventos.findFirst({
                where: {
                    nombre: nombreEvento,
                    usuario: {
                        nombreUsuario: nombreHost
                    }
                }
            })

            if (!event) {
                throw new Error('User is not host of event')
            }

            const newEvent = await prisma.usuarioEventos.create({
                data: {
                    confirmacion: false,
                    usuario: {
                        connect: {
                            nombreUsuario
                        }
                    },
                    evento: {
                        connect: {
                            nombre: nombreEvento
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

    async deleteUserFromEvent(eventInfo) {
        try {
            const {nombreHost, nombreUsuario, nombreEvento } = eventInfo

            const event = await prisma.eventos.findFirst({
                where: {
                    nombre: nombreEvento,
                    usuario: {
                        nombreUsuario: nombreHost
                    }
                }
            })

            if (!event) {
                throw new Error('User is not host of event')
            }

            const newEvent = await prisma.usuarioEventos.delete({
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
                    },
                }
            })
            
            return newEvent
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async getEventParticipants(eventInfo) {
        const { nombreEvento } = eventInfo
        
        const participants = await prisma.usuarioEventos.findMany({
            where: {
                evento: {
                    nombre: nombreEvento
             
                }
            }
        })
        return participants

    }
    catch (err) {
        console.error(err.message);
    }

    async deleteEvent (eventInfo) {
        try {
            const { nombreEvento, nombreHost } = eventInfo

            const event = await prisma.eventos.findFirst({
                where: {
                    nombre: nombreEvento,
                    usuario: {
                        nombreUsuario: nombreHost
                    }
                }
            })

            if (!event) {
                throw new Error('User is not host of event')
            }

            const deletedEvent = await prisma.eventos.delete({
                where: {
                    nombre: nombreEvento
                },
                include: {
                    usuario: {
                        select: {
                            nombreUsuario: true
                        }
                    }
                }
            })

            if (!deletedEvent) {
                throw new Error('Error deleting event')
            }

            return deletedEvent
        }
        catch (err) {
            console.error(err.message);
        }
    }
}

module.exports = new eventService()