import { z } from 'zod';

const updateUserProfileSchema = z.object({
    name: z.string().min(1),
    lastname: z.string().min(1)
});

export const validateUpdateUserProfile = (input) => {
    return updateUserProfileSchema.safeParse(input)
}