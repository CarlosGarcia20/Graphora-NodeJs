import cors from 'cors'

const ACCEPTED_ORIGINS = [
<<<<<<< HEAD
    'http://localhost:4200/',
    'http://localhost:4200'
=======
    'http://localhost:4200',
    'http://localhost:4200/'
>>>>>>> master
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {

        if (acceptedOrigins.includes(origin)) {
            return callback(null, true)
        }
        
        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('Not Allowed by CORS'))
    }
})