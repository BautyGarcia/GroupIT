require('dotenv').config()
const express = require('express');
const app = express();
const GroupIT_Controller = require('./controllers/groupit_Controller');
const PORT = process.env.PORT || 5000;

app.use(express.json()); 

//Rutas



//Listen

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});