const events_Service = require('../service/event_Service');

class eventController {
    createEvent(eventInfo){
        return events_Service.createEvent(eventInfo)
    }

    getAllEvents(){
        return events_Service.getAllEvents()
    }

    getMyEvents(eventInfo){
        return events_Service.getMyEvents(eventInfo)
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

module.exports = new eventController()