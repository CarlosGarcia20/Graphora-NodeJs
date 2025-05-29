import zod from 'zod'

const templateSchema = zod.object({
    name: zod.string().min(1),
    description: zod.string().nullable().optional(),
    category_id: zod.number().int().nullable().optional(),
    template_data: zod.record(zod.any())
});

export const validateTemplate = (input) => {
    return templateSchema.safeParse(input)
}