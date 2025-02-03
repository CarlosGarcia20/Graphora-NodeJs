import express from 'express'
import { PORT } from './config.js'
import { usersRouter } from './routes/user.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.use(express.json())

app.use(corsMiddleware())

app.disable('x-powered-by')

app.use('/users', usersRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})