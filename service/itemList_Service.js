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
                cantidad: true
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

        const checkList = await prisma.consasTraer.findFirst({
            where: {
                nombreObjeto: nombreObjeto
            }
        })

        if (!!checkList) {
            throw new Error("Item already exists")
        }

        const newList = await prisma.consasTraer.create({
            data: {
                nombreObjeto,
                cantidad: cantidadObjeto,
                evento: {
                    connect: {
                        nombreEvento
                    }
                },
                usuario: {
                    connect: {
                        nombreUsuario: nombreHost
                    }
                }
            }
        })

        return newList
    }
}

module.exports = new itemListService()