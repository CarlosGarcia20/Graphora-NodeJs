import zod from 'zod'

const createDiagramSchema = zod.object({
    name: zod.string().min(1, "El nombre es requerido"),
    description: zod.string().optional(),
    template_data: zod.record(zod.any())
})

export const validateCreateDiagram = (input) => {
    return createDiagramSchema.safeParse(input);
}