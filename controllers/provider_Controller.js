const providers_Service = require('../service/provider_Service');

class providerController {
    async getAllProviders() {
        return providers_Service.getAllProviders();
    }

    async createProvider(providerInfo) {
        return providers_Service.createProvider(providerInfo);
    }

    async updateProvider(providerInfo) {
        return providers_Service.updateProvider(providerInfo);
    }

    async deleteProvider(providerInfo) {
        return providers_Service.deleteProvider(providerInfo);
    }

    async getProvidersOfAnEvent(providerInfo) {
        return providers_Service.getProvidersOfAnEvent(providerInfo);
    }

    async addProviderToEvent(providerInfo) {
        return providers_Service.addProviderToEvent(providerInfo);
    }

    async deleteProviderFromEvent(providerInfo) {
        return providers_Service.deleteProviderFromEvent(providerInfo);
    }

    async getProvidersByEvent(providerInfo) {
        return providers_Service.getProvidersByEvent(providerInfo);
    }

    async getEventsOfAProvider(providerInfo) {
        return providers_Service.getEventsOfAProvider(providerInfo);
    }

    async getMyServices(providerInfo) {
        return providers_Service.getMyServices(providerInfo);
    }

}

module.exports = new providerController();