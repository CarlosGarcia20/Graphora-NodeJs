import z from 'zod';

const loginSchema = z.object({
    email: z.string({
        invalid_type_error: 'Email must be a string',
        required_error: 'Email is required'
    }).toLowerCase(),
    password: z.string({
        invalid_type_error: 'Password must be a string',
        required_error: 'Password is required'
    }).toLowerCase()
});