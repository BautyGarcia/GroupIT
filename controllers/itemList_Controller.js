const itemList_Service = require('../service/itemList_Service');

class itemListController {
    async getItemsToBring(listInfo) {
        return itemList_Service.getItemsToBring(listInfo);
    }

    async getItemsBrought(listInfo) {
        return itemList_Service.getItemsBrought(listInfo);
    }

    async setItemsToBring(listInfo) {
        return itemList_Service.setItemsToBring(listInfo);
    }

    async setItemsBrought(listInfo) {
        return itemList_Service.setItemsBrought(listInfo);
    }
}

module.exports = new itemListController();