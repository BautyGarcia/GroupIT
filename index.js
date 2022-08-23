require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors')
const expressSession = require('express-session')
const PORT = process.env.PORT || 5000;
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { router : userRoutes, basePath : userBasePath} = require('./routes/user.routes');
const { router : eventRoutes, basePath : eventBasePath} = require('./routes/event.routes');
const { router : authRoutes, basePath : authBasePath} = require('./routes/auth.routes');
const { router : providerRoutes, basePath : providerBasePath} = require('./routes/provider.routes');

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

app.use(userBasePath, userRoutes);

app.use(eventBasePath, eventRoutes);

app.use(authBasePath, authRoutes);

app.use(providerBasePath, providerRoutes);

//ListaCosas

//-------------------------------Listen-------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});