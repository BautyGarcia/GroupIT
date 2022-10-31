const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class itemListService {
    async getItemsToBring(listInfo) {

        const { nombreEvento } = listInfo

        const itemsToBring = await prisma.cosasTraer.findMany({
            where: {
                evento: {
                    nombre: nombreEvento
                }
            },
            select: {
                nombreObjeto: true,
                cantidad: true
            }
        })

        if (!itemsToBring) {
            throw new Error("Items to bring not found")
        }

        return itemsToBring
    }

    async getItemsBrought(listInfo) {
            
        const { nombreEvento } = listInfo
    
        const itemsBrought = await prisma.cosasTraidas.findMany({
            where: {
                evento: {
                    nombre: nombreEvento
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

        if (!itemsBrought) {
            throw new Error("Items brought not found")
        }
    
        return itemsBrought
    }

    async setItemsToBring(listInfo) {

        const { nombreEvento, nombreHost, nombreObjeto, cantidadObjeto } = listInfo
        
        //Busco que exista un evento de ese usuario con ese nombre
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

        //Me fijo si ya hay un registro de ese objeto
        const checkList = await prisma.cosasTraer.findFirst({
            where: {
                nombreObjeto
            }
        })

        if (checkList) {

            //Si existe un registro de ese objeto, sumo la cantidad
            const newCheckList = await prisma.cosasTraer.update({
                where: {
                    id: checkList.id
                },
                data: {
                    cantidad: {
                        increment: cantidadObjeto,
                    },
                    cantidadTotal: {
                        increment: cantidadObjeto,
                    }
                }
            })

            if (newCheckList.cantidad <= 0){

                //Si me ingresan un numero negativo, y la resta da 0 o menos, elimino el registro
                const deleteCheckList = await prisma.cosasTraidas.delete({
                    where: {
                        evento: {
                            nombre: nombreEvento
                        },
                        nombreObjeto
                    }
                })

                return deleteCheckList
            }

            return newCheckList
        } 
        else {

            //Si no existe el registro de ese objeto, lo creo
            const newList = await prisma.cosasTraer.create({
                data: {
                    nombreObjeto,
                    cantidad: cantidadObjeto,
                    cantidadTotal: cantidadObjeto,
                    evento: {
                        connect: {
                            nombre: nombreEvento
                        }
                    }
                }
            })

            return newList
        }
    }

    async setItemsBrought(listInfo) {
        const { nombreEvento, nombreObjeto, cantidadObjeto, nombreUsuario } = listInfo

        //Me fijo si el evento existe
        const event = await prisma.eventos.findFirst({
            where: {
                nombre: nombreEvento
            }
        })

        if(!event) {
            throw new Error("Event not found")
        }

        //Me fijo si el usuario esta en el evento
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

        //Me fijo si ese objeto esta en la lista de cosas para traer
        const checkList = await prisma.cosasTraer.findFirst({
            where: {
                nombreObjeto
            }
        })

        if (cantidadObjeto > checkList.cantidad) {
            throw new Error("You brought more than you were supposed to")
        }

        if (!checkList) {
            throw new Error("Item not found")
        }

        //Me fijo si el usuario ya trajo ese objeto
        const sumItems = await prisma.cosasTraidas.findFirst({
            where: {
                nombreObjeto,
                usuario: {
                    nombreUsuario
                }
            }
        })

        //Si no trajo ese objeto, creo el registro en cosasTraidas y cambio la cantidad en cosasTraer
        if (!sumItems) {
            const sumList = await prisma.cosasTraidas.create({
                data: {
                    nombreObjeto,
                    cantidad: cantidadObjeto,
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

            if (sumList.cantidad <= 0){

                const deleteList = await prisma.cosasTraidas.delete({
                    where: {
                        id: sumList.id
                    }
                })

                return deleteList

            } else {
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
    
                return newList
            }

        } else {
            //Si ya lo trajo, sumo la cantidad en cosasTraidas y resto en cosasTraer
            const sumList = await prisma.cosasTraidas.update({
                where: {
                    id: sumItems.id
                },
                data: {
                    cantidad: {
                        increment: cantidadObjeto
                    }
                }
            })

            if (sumList.cantidad <= 0){
                await prisma.cosasTraidas.delete({
                    where: {
                        id: sumList.id
                    }
                })

                return new Error("You inserted a nonesense brought value")

            } else {
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
            }

            return sumList
            
        }
    }
}

module.exports = new itemListService()