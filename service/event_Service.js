const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class eventService {

    async createEvent(eventInfo) {
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

        if (!newEvent) {
            throw new Error('Error creating event')
        }

        return newEvent
    }

    async getAllEvents() {
        
        const allEvents = await prisma.eventos.findMany({
            include: {
                usuario: {
                    select: {
                        nombreUsuario: true
                    }
                }
            }
        })

        if (!allEvents) {
            throw new Error('Error getting all events')
        }
        
        return allEvents;
    }

    async getMyEvents(eventInfo) {
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

        if (!event) {
            throw new Error('Error getting my events')
        }

        return event;
    }

    async updateEvent(eventInfo) {

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

        if (!newEvent) {
            throw new Error('Error updating event')
        }
        
        return newEvent

    }

    async addUserToEvent(eventInfo) {

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

        if (!newEvent) {
            throw new Error('Error adding user to event')
        }
        
        return newEvent

    }

    async deleteUserFromEvent(eventInfo) {

        const { nombreHost, nombreUsuario, nombreEvento } = eventInfo

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

        const getUserToDelete = await prisma.usuarioEventos.findFirst({
            where: {
                usuario: {
                    nombreUsuario
                },
                evento: {
                    nombre: nombreEvento
                }
            }
        })

        if (!getUserToDelete) {
            throw new Error('User is not in event')
        }

        const newEvent = await prisma.usuarioEventos.delete({
            where: {
                id: getUserToDelete.id
            },
            include: {
                usuario: {
                    select: {
                        nombreUsuario: true
                    }
                },
            }
        })

        if (!newEvent) {
            throw new Error('Error deleting user from event')
        }
        
        return newEvent

    }

    async getEventParticipants(eventInfo) {

        const { nombreEvento } = eventInfo
        
        const participants = await prisma.usuarioEventos.findMany({
            where: {
                evento: {
                    id: nombreEvento
                }
            },
            select: {
                confirmacion: true,
                usuario: {
                    select: {
                        nombreUsuario: true,
                        mail: true
                    }
                },
            }
        })

        if (!participants) {
            throw new Error('Error getting event participants')
        }

        return participants

    }

    async deleteEvent (eventInfo) {

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

    async confirmEvent (eventInfo) {
        
        const { nombreEvento, nombreUsuario, confirmationState } = eventInfo

        const event = await prisma.usuarioEventos.findFirst({
            where: {
                usuario: {
                    nombreUsuario
                },
                evento: {
                    nombre: nombreEvento
                }
            }
        })

        if (!event) {
            throw new Error('User is not in event')
        }

        const newEvent = await prisma.usuarioEventos.update({
            where: {
                id: event.id
            },
            data: {
                confirmacion: confirmationState
            }
        })

        if  (!newEvent) {
            throw new Error('Error updating event confirmation')
        }

        return newEvent

    }

    async quitEvent (eventInfo) {
        
        const { nombreEvento, nombreUsuario } = eventInfo

        const event = await prisma.usuarioEventos.findFirst({
            where: {
                usuario: {
                    nombreUsuario
                },
                evento: {
                    nombre: nombreEvento
                }
            }
        })

        if (!event) {
            throw new Error('User is not in event')
        }

        const newEvent = await prisma.usuarioEventos.delete({
            where: {
                id: event.id
            },
            include: {
                usuario: {
                    select: {
                        nombreUsuario: true
                    }
                }
            }
        })

        if (!newEvent) {
            throw new Error('Error deleting event')
        }

        return newEvent
    }
}

module.exports = new eventService()