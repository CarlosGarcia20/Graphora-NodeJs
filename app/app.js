import express from 'express'
import morgan from 'morgan'

// Archivos de configuracion
import { PORT } from './config/config.js'

//Rutas 
import { usersRouter } from './routes/user.routes.js'
import { loginRouter } from './routes/auth.routes.js'
import { diagramsRouter } from './routes/diagram.routes.js'
import { emailRouter } from './routes/email.routes.js'

// Middlewares
import { corsMiddleware } from './middlewares/cors.js'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(corsMiddleware())

app.disable('x-powered-by')

app.use('/auth', loginRouter)
app.use('/users', usersRouter)
app.use('/diagram', diagramsRouter)
app.use('/email', emailRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})