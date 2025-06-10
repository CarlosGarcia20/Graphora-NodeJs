import express from 'express'
import morgan from 'morgan'
import { createServer } from 'node:http';
import { Server } from 'socket.io'

// Archivos de configuracion
import { PORT } from './config/config.js'

//Rutas 
import { usersRouter } from './routes/user.routes.js'
import { loginRouter } from './routes/auth.routes.js'
import { diagramsRouter } from './routes/diagram.routes.js'

// Middlewares
import { corsMiddleware, ACCEPTED_ORIGINS } from './middlewares/cors.js'
import { setupSocketConnections } from './sockets/connection_handler.js';

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: ACCEPTED_ORIGINS,
        methods: ['GET', 'POST']
    }
})

setupSocketConnections(io)

// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(corsMiddleware())
app.disable('x-powered-by')

// Rutas
app.use('/auth', loginRouter)
app.use('/users', usersRouter)
app.use('/diagram', diagramsRouter)

// Crear servidor HTTP
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})