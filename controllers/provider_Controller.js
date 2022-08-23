const providers_Service = require('../service/provider_Service');

class providerController {
    async getAllProviders() {
        return providers_Service.getAllProviders();
    }
}

module.exports = new providerController();