import { z } from 'zod';

const updateEmailSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña es requerida"),
    newEmail: z.string().email().toLowerCase(),
});

export function validateEmailUpdate(input) {
    return updateEmailSchema.safeParse(input);
}