import zod from 'zod';

const updateTemplateSchema = zod.object({
    name: zod.string().min(1).optional(),
    description: zod.string().nullable().optional(),
    category_id: zod.number().int().optional(),
    template_data: zod.record(zod.any()).optional()
});

export const validateUpdateTemplate = (input) => {
    return updateTemplateSchema.safeParse(input)
}