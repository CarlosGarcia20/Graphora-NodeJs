import { AppError } from "../../../errors/AppError.js"

const PG_ERROR_MAP = {
   '23503': (err) => new AppError('Referencia inválida', 400),
   '23502': (err) => new AppError(`El campo "${err.column}" es requerido`, 400),
   '22P02': (err) => new AppError('Formato de dato inválido', 400),
}

const CONSTRAINT_MESSAGES = {
  'email': 'El email ya se encuentra registrado'
}

export function mapPostgresError(error) {
   const mapper = PG_ERROR_MAP[error.code]
   
   if(error.code == '23505') {
      const message = CONSTRAINT_MESSAGES[error.constraint] || 'El recurso ya existe'
      return new AppError(message, 409)
   }

   if (mapper) return mapper(error)
   return error
}