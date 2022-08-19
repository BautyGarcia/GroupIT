const events_Service = require('../service/events_Service');
const user_Service = require('../service/user_Service');
class GroupITController {

    getAllUsers(){
        return user_Service.getAllUsers()
    }

    createUser(userInfo){
        return user_Service.createUser(userInfo)
    }

    updatePassword(userInfo){
        return user_Service.updatePassword(userInfo)
    }

    deleteUser(userInfo){
        return user_Service.deleteUser(userInfo)
    }
    
    login(userInfo){
        return user_Service.login(userInfo)
    }

    createEvent(eventInfo){
        return events_Service.createEvent(eventInfo)
    }

    getAllEvents(){
        return events_Service.getAllEvents()
    }

    getEventByUsername(eventInfo){
        return events_Service.getEventByUsername(eventInfo)
    }

    updateEvent(eventInfo){
        return events_Service.updateEvent(eventInfo)
    }

    addUserToEvent(eventInfo){
        return events_Service.addUserToEvent(eventInfo)
    }
    
    deleteUserFromEvent(eventInfo){
        return events_Service.deleteUserFromEvent(eventInfo)
    }

    getEventParticipants(eventInfo){
        return events_Service.getEventParticipants(eventInfo)
    }

}

module.exports = new GroupITController()