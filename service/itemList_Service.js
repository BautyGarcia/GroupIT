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

    async setItemsBrought(listInfo) {
        
        const { nombreEvento, nombreObjeto, cantidadObjeto, nombreUsuario } = listInfo

        const event = await prisma.usuarioEventos.findFirst({
            where: {
                evento: {
                    nombreEvento
                },
                usuario: {
                    nombreUsuario
                }
            }
        })

        if (!event) {
            throw new Error("Event not found")
        }

        const checkList = await prisma.consasTraer.findFirst({
            where: {
                nombreObjeto
            }
        })

        if (!checkList) {
            throw new Error("Item not found")
        }

        const newList = await prisma.consasTraer.update({
            where: {
                nombreObjeto: nombreObjeto,
                evento: {
                    nombreEvento
                }
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
                        nombreEvento
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