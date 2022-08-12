require('dotenv').config()
const express = require('express');
const app = express();
const GroupIT_Controller = require('./controllers/groupit_Controller');
const PORT = process.env.PORT || 5000;

app.use(express.json()); 

//Rutas

app.get("/users", async (req, res) => {
    const users = await GroupIT_Controller.getAllUsers();
    res.json(users);
});

app.post("/createUser", async (req, res) => {
    const userInfo = req.body
    const user = await GroupIT_Controller.createUser(userInfo);
    res.json(user);
});

//Listen

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});