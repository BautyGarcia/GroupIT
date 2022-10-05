const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class providerService {

    async getAllProviders() {
        return await prisma.proveedores.findMany()
    }

    async createProvider(providerInfo) {
        
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

        if (!newProvider) {
            throw new Error('Error creating provider')
        }

        return newProvider

    }

    async updateProvider(providerInfo) {
        
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

        if (!updatedProvider) {
            throw new Error('Error updating provider')
        }
        
        return updatedProvider
 
    }

    async deleteProvider(providerInfo) {
        
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

    async addProviderToEvent(providerInfo) {

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

        const checkIfProviderIsInEvent = await prisma.EventosProveedor.findFirst({
            where: {
                idEvento: event.id,
                idProveedor: provider.id
            }
        })

        if (checkIfProviderIsInEvent) {
            throw new Error('Provider is already in event')
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

    async deleteProviderFromEvent(providerInfo) {

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

    async getProvidersOfAnEvent(providerInfo) {

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

    // Devuelve todos los eventos en los que un proveedor esta registrado
    async getEventsOfAProvider(providerInfo) {

        const { nombreUsuario, nombreProveedor } = providerInfo

        const provider = await prisma.proveedores.findFirst({
            where: {
                nombre: nombreProveedor
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

    async getMyServices(providerInfo) {

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

    async getProviderInfo(providerInfo) {

        const { nombreProveedor } = providerInfo

        const provider = await prisma.proveedores.findFirst({
            where: {
                nombre: nombreProveedor
            }
        })

        if (!provider) {
            throw new Error('Provider not found')
        }

        return provider

    }
}


module.exports = new providerService()