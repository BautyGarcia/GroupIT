require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')
const expressSession = require('express-session')
const GroupIT_Controller = require('./controllers/groupit_Controller');
const PORT = process.env.PORT || 5000;
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');


//Setting up the app

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: `http://localhost:${PORT}`,
        methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
        credentials: true,
    })
)

//session store and session config
app.use(
    expressSession({
      cookie: {
       maxAge: 7 * 24 * 60 * 60 * 1000 // ms
      },
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(
        new PrismaClient(),
        {
          checkPeriod: 2 * 60 * 1000,  //ms
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      )
    })
  );

//-------------------------------Rutas-------------------------------

//User

app.get("/users", async (req, res) => {
    const users = await GroupIT_Controller.getAllUsers();
    res.json(users);
});

app.post("/login", async (req, res) => {
    const userInfo = req.body
    const user = await GroupIT_Controller.login(userInfo);

    if(user){
        req.session.user = {
            id: user.id,
            nombreUsuario: user.nombreUsuario,
            password: user.password,
            email: user.mail
        }
    }

    res.json(user);
});

app.post("/logout", async (req, res) => {
    try {
        await req.session.destroy()
        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.sendStatus(403)
    }
});

app.post("/getSession", async (req, res) => {
    if (req.sessionID && req.session.user) {
        res.status(200)
        return res.json({ user: req.session.user })
    }
    return res.sendStatus(403)
})

app.post("/createUser", async (req, res) => {
    const userInfo = req.body
    const user = await GroupIT_Controller.createUser(userInfo);
    
    if(user){
        req.session.user = {
            id: user.id,
            nombreUsuario: user.nombreUsuario,
            password: user.password,
            email: user.mail
        }
    }

    res.json(user);
});

app.put("/updatePassword", async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.session.user.nombreUsuario
    const user = await GroupIT_Controller.updatePassword(userInfo);
    res.json(user);
});

app.delete("/deleteUser", async (req, res) => {
    const userInfo = req.body
    userInfo.nombreUsuario = req.session.user.nombreUsuario
    const user = await GroupIT_Controller.deleteUser(userInfo);
    req.session.destroy()
    res.json(user);
});

//Eventos

app.post("/createEvent", async (req, res) => {
    const eventInfo = req.body
    if(req.session.user.nombreUsuario == undefined){
        throw new Error("You must be logged in")
    } else eventInfo.nombreUsuario = req.session.user.nombreUsuario 
    const event = await GroupIT_Controller.createEvent(eventInfo);
    res.json(event);
});

app.get("/events", async (req, res) => {
    const events = await GroupIT_Controller.getAllEvents();
    res.json(events);
});

app.get("/myEvents", async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.session.user.nombreUsuario
        const event = await GroupIT_Controller.getMyEvents(eventInfo);
        res.json(event);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

app.put("/updateEvent", async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.session.user.nombreUsuario
        const newEvent = await GroupIT_Controller.updateEvent(eventInfo);
        res.json(newEvent);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

app.post("/addUser", async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.session.user.nombreUsuario
        const newUser = await GroupIT_Controller.addUserToEvent(eventInfo);
        res.json(newUser);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

app.delete("/deleteUser", async (req, res) => {
    try {
        const eventInfo = req.body
        eventInfo.nombreUsuario = req.session.user.nombreUsuario
        const deletedUser = await GroupIT_Controller.deleteUserFromEvent(eventInfo);
        res.json(deletedUser);
    }
    catch (err) {
        console.error(err.message)
        res.status(403).send("You must login");
    }
});

app.get("/participants", async (req, res) => {
    const eventInfo = req.body
    const participants = await GroupIT_Controller.getEventParticipants(eventInfo);
    res.json(participants);
});

//Proveedores

//ListaCosas

//-------------------------------Listen-------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});