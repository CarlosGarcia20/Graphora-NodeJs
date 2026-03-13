import express from 'express'
import morgan from 'morgan'

// Archivos de configuracion
import { PORT } from './app/config/config.js'

//Rutas 
import { createUserRouter } from './app/routes/user.routes.js'
import { createAuthRouter } from './app/routes/auth.routes.js'
import { createDiagramsRouter } from './app/routes/diagram.routes.js'

// Middlewares
import { corsMiddleware } from './app/middlewares/cors.js'

export const createApp = ({ models }) => {
    const app = express()
    
    app.use(morgan('dev'))
    app.use(express.json())
    app.use(corsMiddleware())
    
    app.disable('x-powered-by')
    
    app.use('/auth', createAuthRouter({ loginModel: models.loginModel }))
    app.use('/users', createUserRouter({ userModel: models.userModel }))
    app.use('/diagram', createDiagramsRouter({ diagramModel: models.diagramModel }))

    app.use((err, req, res, next) => {
        console.error("Error detectado:", err);
        
        res.status(500).json({ 
            message: "Internal Server Error", 
            // error: err.message 
        });
    });
    
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    })
}
