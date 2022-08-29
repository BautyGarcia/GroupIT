const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class itemListService {
    async getItemsToBring(listInfo) {

        const { nombreEvento } = listInfo

        const itemsToBring = await prisma.consasTraer.findMany({
            where: {
                evento: {
                    nombreEvento
                }
            },
            select: {
                nombreObjeto: true,
                cantidad: true
            }
        })

        return itemsToBring
    }

    async getItemsBrought(listInfo) {
            
        const { nombreEvento } = listInfo
    
        const itemsBrought = await prisma.consasTraer.findMany({
            where: {
                evento: {
                    nombreEvento
                }
            },
            select: {
                nombreObjeto: true,
                cantidad: true,
                usuario: {
                    select: {
                        nombreUsuario: true
                    }
                }
            }
        })
    
        return itemsBrought
    }

    async setItemsToBring(listInfo) {

        const { nombreEvento, nombreHost, nombreObjeto, cantidadObjeto } = listInfo

        const event = await prisma.eventos.findFirst({
            where: {
                nombre: nombreEvento,
                usuario: {
                    nombreUsuario: nombreHost
                }
            }
        })

        if (!event) {
            throw new Error("Event not found")
        }

        const checkList = await prisma.cosasTraer.findFirst({
            where: {
                nombreObjeto: nombreObjeto
            }
        })

        if (!!checkList) {
            throw new Error("Item already exists")
        }

        const newList = await prisma.cosasTraer.create({
            data: {
                nombreObjeto,
                cantidad: cantidadObjeto,
                evento: {
                    connect: {
                        nombre: nombreEvento
                    }
                }
            }
        })

        return newList
    }

    async setItemsBrought(listInfo) {
        
        const { nombreEvento, nombreObjeto, cantidadObjeto, nombreUsuario } = listInfo

        const event = await prisma.eventos.findFirst({
            where: {
                nombre: nombreEvento
            }
        })

        if(!event) {
            throw new Error("Event not found")
        }

        const eventParticipant = await prisma.usuarioEventos.findFirst({
            where: {
                usuario: {
                    nombreUsuario
                },
                evento: {
                    nombre: nombreEvento
                }
            }
        })

        if (!eventParticipant) {
            throw new Error("You are not part of this event")
        }

        const checkList = await prisma.cosasTraer.findFirst({
            where: {
                nombreObjeto
            }
        })

        if (!checkList) {
            throw new Error("Item not found")
        }

        const newList = await prisma.cosasTraer.update({
            where: {
                id: checkList.id
            },
            data: {
                cantidad: {
                    decrement: cantidadObjeto
                }
            }
        })

        const newBroughtList = await prisma.cosasTraidas.create({
            data: {
                nombreObjeto,
                cantidad: cantidadObjeto,
                evento: {
                    connect: {
                        nombre: nombreEvento
                    }
                },
                usuario: {
                    connect: {
                        nombreUsuario
                    }
                }
            },
            select: {
                nombreObjeto: true,
                cantidad: true,
                usuario: {
                    select: {
                        nombreUsuario: true
                    }
                }
            }
        })    
        
        return newBroughtList
    }
}

module.exports = new itemListService()