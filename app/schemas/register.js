import zod from 'zod';

const registerSchema = zod.object({
    email: zod.string()
        .trim()
        .toLowerCase()
        .max(255, { message: "El correo electrónico es demasiado largo" })
        .email({ message: "El correo electrónico no es válido" }),
    password: zod.string()
        .min(8, { message: "La contraseña debe contener al menos 8 caracteres" })
        .max(72, { message: "La contraseña no puede exceder 72 caracteres" }),
    name: zod.string()
        .trim()
        .min(2, { message: "El nombre debe contener al menos 2 caracteres" })
        .max(255, { message: "El nombre es demasiado largo" }),
    lastname: zod.string()
        .trim()
        .min(2, { message: "El apellido debe contener al menos 2 caracteres" })
        .max(255, { message: "El apellido es demasiado largo" })
});

export const validateRegister = (input) => {
    return registerSchema.safeParse(input);
}