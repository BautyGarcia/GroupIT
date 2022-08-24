const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class providerService {

    async getAllProviders() {
        try {
            const allProviders = await prisma.proveedores.findMany()
            return allProviders;
        }
        catch (err) {
            console.error(err.message);
            throw err
        }
    }

    async createProvider(providerInfo) {
        try {
            const { nombreUsuario, nombre, tipoServicio, personasMinimas, precio, contacto } = providerInfo
            const newProvider = await prisma.proveedores.create({
                data: {
                    nombre,
                    tipoServicio,
                    personasMinimas,
                    precio,
                    contacto,
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
            return newProvider
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async updateProvider(providerInfo) {
        try {
            const { nombreUsuario, nombre, tipoServicio, personasMinimas, precio, contacto } = providerInfo

            const providerToUpdate = await prisma.proveedores.findFirst({
                where: {
                    nombre,
                    usuario: {
                        nombreUsuario
                    }
                }
            })

            if (!providerToUpdate) {
                throw new Error("Provider not found")
            }

            const updatedProvider = await prisma.proveedores.update({
                where: {
                    id: providerToUpdate.id
                },
                data: {
                    tipoServicio,
                    personasMinimas,
                    precio,
                    contacto
                },
                include: {
                    usuario: {
                        select: {
                            nombreUsuario: true
                        }
                    }
                }
            })
            return updatedProvider
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async deleteProvider(providerInfo) {
        try {
            const { nombreUsuario, nombre } = providerInfo

            const providerToDelete = await prisma.proveedores.findFirst({
                where: {
                    nombre,
                    usuario: {
                        nombreUsuario
                    }
                }
            })

            if (!providerToDelete) {
                throw new Error("Provider not found")
            }

            const deletedProvider = await prisma.proveedores.delete({
                where: {
                    id: providerToDelete.id
                }
            })
            return deletedProvider
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async addProviderToEvent(providerInfo) {
        try {
            const { nombreUsuario, nombreProveedor, nombreEvento } = providerInfo

            const provider = await prisma.proveedores.findFirst({
                where: {
                    nombre: nombreProveedor
                }
            })

            if (!provider) {
                throw new Error('Provider not found')
            }

            const event = await prisma.eventos.findFirst({
                where: {
                    nombre: nombreEvento,
                    usuario: {
                        nombreUsuario
                    }
                }
            })

            if (!event) {
                throw new Error('Event not found')
            }

            const newProvider = await prisma.EventosProveedor.create({
                data: {
                    evento: {
                        connect: {
                            nombre: nombreEvento
                        }
                    },
                    proveedor: {
                        connect: {
                            nombre: nombreProveedor
                        }
                    }
                },
                include: {
                    proveedor: {
                        select: {
                            nombre: true,
                            personasMinimas: true,
                            precio: true,
                            contacto: true
                        }
                    },
                    evento: {
                        select: {
                            nombre: true,
                            fecha: true,
                            lugar: true
                        }
                    }
                }
            })
            return newProvider
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async deleteProviderFromEvent(providerInfo) {
        try {
            const { nombreUsuario, nombreProveedor, nombreEvento } = providerInfo

            const providerToDelete = await prisma.EventosProveedor.findFirst({
                where: {
                    evento: {
                        nombre: nombreEvento,
                        usuario: {
                            nombreUsuario
                        }
                    },
                    proveedor: {
                        nombre: nombreProveedor
                    }
                }
            })

            if (!providerToDelete) {

                throw new Error('Provider not found in event')
            }

            const deletedProvider = await prisma.EventosProveedor.delete({
                where: {
                    id: providerToDelete.id
                },
                include: {
                    proveedor: {
                        select: {
                            nombre: true,
                            personasMinimas: true,
                            precio: true,
                            contacto: true
                        }
                    },
                    evento: {
                        select: {
                            nombre: true,
                            fecha: true,
                            lugar: true
                        }
                    }
                }
            })
            return deletedProvider
        }
        catch (err) {
            console.error(err.message);
        }
    }

    //Devuelve todos los proveedores registrados en un evento
    async getProvidersOfAnEvent(providerInfo) {
        try {
            const { nombreUsuario, nombreEvento } = providerInfo

            const myEvent = await prisma.eventos.findFirst({
                where: {
                    nombre: nombreEvento,
                    usuario: {
                        nombreUsuario
                    }
                }
            })

            if (!myEvent) {
                throw new Error('Event not found')
            }

            const myServices = await prisma.EventosProveedor.findMany({
                where: {
                    idEvento: myEvent.id
                },
                include: {
                    proveedor: true
                }
            })

            return myServices

        }
        catch (err) {
            console.error(err.message);
        }
    }

    // Devuelve todos los eventos en los que un proveedor esta registrado
    async getEventsOfAProvider(providerInfo) {
        try {
            const { nombreUsuario, nombreProveedor } = providerInfo

            const provider = await prisma.proveedores.findFirst({
                where: {
                    nombre: nombreProveedor,
                    usuario: {
                        nombreUsuario
                    }
                }
            })

            if (!provider) {
                throw new Error('Provider not found')
            }

            const myEvents = await prisma.EventosProveedor.findMany({
                where: {
                    idProveedor: provider.id
                },
                include: {
                    evento: true
                }
            })
            return myEvents
        }
        catch (err) {
            console.error(err.message);
        }
    }

    async getMyServices(providerInfo) {
        try {
            const { nombreUsuario } = providerInfo

            const myServices = await prisma.proveedores.findMany({
                where: {
                    usuario: {
                        nombreUsuario
                    }
                },
                select: {
                    nombre: true,
                    personasMinimas: true,
                    precio: true,
                    contacto: true
                }
            })
            return myServices
        }
        catch (err) {
            console.error(err.message);
        }
    }
}


module.exports = new providerService()