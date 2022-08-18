require('dotenv').config()
const express = require('express');
const app = express();
const GroupIT_Controller = require('./controllers/groupit_Controller');
const PORT = process.env.PORT || 5000;

app.use(express.json()); 

//-------------------------------Rutas-------------------------------

//User

app.get("/users", async (req, res) => {
    const users = await GroupIT_Controller.getAllUsers();
    res.json(users);
});

app.get("/user", async (req, res) => {
    const userInfo = req.body
    const user = await GroupIT_Controller.getUser(userInfo);
    res.json(user);
});

app.post("/createUser", async (req, res) => {
    const userInfo = req.body
    const user = await GroupIT_Controller.createUser(userInfo);
    res.json(user);
});

app.put("/updatePassword", async (req, res) => {
    const userInfo = req.body
    const user = await GroupIT_Controller.updatePassword(userInfo);
    res.json(user);
});

app.delete("/deleteUser", async (req, res) => {
    const userInfo = req.body
    const user = await GroupIT_Controller.deleteUser(userInfo);
    res.json(user);
});

//Eventos

app.post("/createEvent", async (req, res) => {
    const eventInfo = req.body
    const event = await GroupIT_Controller.createEvent(eventInfo);
    res.json(event);
});

app.get("/events", async (req, res) => {
    const events = await GroupIT_Controller.getAllEvents();
    res.json(events);
});

app.get("/event", async (req, res) => {
    const eventInfo = req.body
    const event = await GroupIT_Controller.getEventByUsername(eventInfo);
    res.json(event);
});

app.put("/updateEvent", async (req, res) => {
    const eventInfo = req.body
    const newEvent = await GroupIT_Controller.updateEvent(eventInfo); 
    res.json(newEvent);
});

app.post("/addUser", async (req, res) => {
    const eventInfo = req.body
    const newEvent = await GroupIT_Controller.addUserToEvent(eventInfo);
    res.json(newEvent);
});

app.delete("/deleteUser", async (req, res) => {
    const eventInfo = req.body
    const newEvent = await GroupIT_Controller.deleteUserFromEvent(eventInfo);
    res.json(newEvent);
});

app.get("/participants", async (req, res) => {
    const eventInfo = req.body
    const participants = await GroupIT_Controller.getEventParticipants(eventInfo);
    res.json(participants);
});

//Proveedores

//-------------------------------Listen-------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});