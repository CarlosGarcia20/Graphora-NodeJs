import express from 'express'
import morgan from 'morgan'

// Archivos de configuracion
import { PORT } from './config.js'

//Rutas 
import { usersRouter } from './routes/user.routes.js'

// Middlewares
import { corsMiddleware } from './middlewares/cors.js'
import { loginRouter } from './routes/login.routes.js'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(corsMiddleware())

app.disable('x-powered-by')

app.use('/login', loginRouter)
app.use('/users', usersRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})