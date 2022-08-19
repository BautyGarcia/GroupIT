require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')
const session = require('express-session')
const GroupIT_Controller = require('./controllers/groupit_Controller');
const { Client } = require('pg')
const { ConnectionString} = require("connection-string")
const PORT = process.env.PORT || 5000;


//Setting up the app

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(
    cors({
        origin: `http://localhost:${PORT}`,
        methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
        credentials: true,
    })
)
//pg init and config
const cnString = new ConnectionString(process.env.DATABASE_URL)
const conObject = {
    user: cnString.user,
    host: cnString.hostname,
    database: cnString.path?.[0],
    password: cnString.password,
    port: cnString.port,

}
const client = new Client(conObject)
client.connect()

//session store and session config

const store = new (require('connect-pg-simple')(session))({
    conObject,
})

app.use(
    session({
        store: store,
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: false,
            httpOnly: false,
            sameSite: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
)

//-------------------------------Rutas-------------------------------

//User

app.get("/users", async (req, res) => {
    const users = await GroupIT_Controller.getAllUsers();
    res.json(users);
});

app.post("/login", async (req, res) => {
    const userInfo = req.body
    const user = await GroupIT_Controller.login(userInfo);

    req.session.user = {
        nombreUsuario: user.nombreUsuario,
        password: user.password,
        email: user.mail
    }

    res.json(user);
});

app.post("/logout", async (req, res) => {
    try {
        await req.session.destroy()
        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.sendStatus(500)
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

    req.session.user = {
        nombreUsuario: user.nombreUsuario,
        password: user.password,
        email: user.mail
    }

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