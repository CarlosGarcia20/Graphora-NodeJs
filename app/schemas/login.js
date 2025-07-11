import zod from 'zod';

const loginSchema = zod.object({
    email: zod.string().email().toLowerCase(),
    password: zod.string().min(8)
});

export function validateLogin(input) {
    return loginSchema.safeParse(input);
}