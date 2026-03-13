import { validateRegister } from "../schemas/register.js";
import { validateUpdate } from "../schemas/updateUser.js"
import { catchAsync } from "../util/catchAsync.js";

export class UserController {
    constructor({ userModel }) {
        this.userModel = userModel
    }
    
    create = catchAsync(async(req, res, next) => {
        const resultado = validateRegister(req.body);

        if (!resultado.success) {
            return res.status(400).json({ message: JSON.parse(resultado.error.message) });
        }

        const result = await this.userModel.createUser({ input: resultado.data });
        
        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        return res.status(201).json({ message: "Usuario creado con éxito" });
    })

    getUsers = catchAsync(async(req, res, next) => {
        const result = await this.userModel.getAllUsers();

        if (!result.success) {
            return res.status(500).json({ 
                message: "Error al obtener usuarios",
                error: result.error
            });
        }

        return res.status(200).json({ users: result.data });
    })

    deleteUser = catchAsync(async(req, res, next) => {
        const { userId } = req.params;
        const result = await this.userModel.deleteUser({ userId });

        if (!result.success) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({ message: "Usuario eliminado con éxito" });
    })

    getUserById = catchAsync(async(req, res, next) => {
        const { userId } = req.params;
        const result = await this.userModel.getUserById({ userId });

        if (!result.success) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            user: {
                email: result.data.email,
                name: result.data.name,
                lastname: result.data.lastname
            }
        });
    })

    updateUser = catchAsync(async(req, res, next) => {
        const userId = req.user.userId
        const validation = validateUpdate(req.body);

        if (!validation.success) {
            return res.status(400).json({ message: JSON.parse(validation.error.message) });
        }

        const result = await this.userModel.updateUser({ userId, input: validation.data })

        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: result.message });
    })
}