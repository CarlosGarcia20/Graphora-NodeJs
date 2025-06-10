import zod from 'zod';

const updateSchema = zod.object({
    email: zod.string().email().toLowerCase().trim().optional(),
    password: zod.string().min(8).optional(),
    name: zod.string().min(3).trim().optional(),
    lastName: zod.string().min(3).trim().optional()
});

export const validateUpdate = (input) => {
    return updateSchema.safeParse(input);
}