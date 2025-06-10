import zod from 'zod';

const registerSchema = zod.object({
    email: zod.string().email().toLowerCase(),
    password: zod.string().min(8),
    name: zod.string().min(3),
    lastName: zod.string().min(3)
});

export const validateRegister = (input) => {
    return registerSchema.safeParse(input);
}