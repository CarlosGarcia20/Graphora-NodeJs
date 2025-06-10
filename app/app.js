import express from 'express'
import morgan from 'morgan'
import http from 'http';
import { Server } from 'socket.io'

// Archivos de configuracion
import { PORT } from './config/config.js'

//Rutas 
import { usersRouter } from './routes/user.routes.js'
import { loginRouter } from './routes/auth.routes.js'
import { diagramsRouter } from './routes/diagram.routes.js'

// Middlewares
import { corsMiddleware, ACCEPTED_ORIGINS } from './middlewares/cors.js'
import { setupNotificationSocket } from './sockets/notification.socket.js'

const app = express()

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
const httpServer = http.createServer(app)
// app.listen(PORT, () => {
//     console.log(`Servidor corriendo en el puerto ${PORT}`);
// })

// Crear servidor Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: ACCEPTED_ORIGINS,
        methods: ['GET', 'POST'],
    }
})

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);
    setupNotificationSocket(io, socket)
})

// Iniciar servidor
httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})