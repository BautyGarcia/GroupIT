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
    const { userInfo } = req.body
    const user = await GroupIT_Controller.getUser(userInfo);
    res.json(user);
});

app.post("/createUser", async (req, res) => {
    const { userInfo } = req.body
    const user = await GroupIT_Controller.createUser(userInfo);
    res.json(user);
});

app.update("/updatePassword", async (req, res) => {
    const { userInfo } = req.body
    const user = await GroupIT_Controller.updatePassword(userInfo);
    res.json(user);
});

app.delete("/deleteUser", async (req, res) => {
    const { userInfo } = req.body
    const user = await GroupIT_Controller.deleteUser(userInfo);
    res.json(user);
});

//Eventos

//Proveedores

//-------------------------------Listen-------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});