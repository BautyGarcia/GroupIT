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
}


module.exports = new providerService()