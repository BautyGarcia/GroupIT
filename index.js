require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { router : userRoutes, basePath : userBasePath} = require('./routes/user.routes');
const { router : eventRoutes, basePath : eventBasePath} = require('./routes/event.routes');
const { router : authRoutes, basePath : authBasePath} = require('./routes/auth.routes');
const { router : providerRoutes, basePath : providerBasePath} = require('./routes/provider.routes');
const { router : itemListRoutes, basePath : itemListBasePath} = require('./routes/itemList.routes');
const PORT = process.env.PORT || 5000;

//Setting up the app

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
        origin: [`http://localhost:3000`,"https://groupit.vercel.app"],
        methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
        credentials: true,
    })
);
app.set("trust proxy", 1);

//-------------------------------Rutas-------------------------------

app.use(userBasePath, userRoutes);  

app.use(eventBasePath, eventRoutes);

app.use(authBasePath, authRoutes);

app.use(providerBasePath, providerRoutes);

app.use(itemListBasePath, itemListRoutes);

//-------------------------------Listen-------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});