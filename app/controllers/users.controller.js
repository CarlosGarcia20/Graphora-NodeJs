import { UserModel } from "../models/users.models.js";
import { validateRegister } from "../schemas/register.js";
import { validateUpdate } from "../schemas/updateUser.js"

export class userController {
    static async create(req, res) {
        try {
            const resultado = validateRegister(req.body);

            if (!resultado.success) {
                return res.status(400).json({ message: JSON.parse(resultado.error.message) });
            }

            const result = await UserModel.createUser({ input: resultado.data });
            
            if (!result.success) {
                return res.status(500).json({ message: result.error });
            }

            return res.status(201).json({ message: "Usuario creado con éxito" });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { idUser } = req.params;
            const result = await UserModel.deleteUser({ idUser });

            if (!result.success) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            return res.status(200).json({ message: "Usuario eliminado con éxito" });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }

    static async getUsers(req, res) {
        try {
            const result = await UserModel.getAllUsers();

            if (!result.success) {
                return res.status(500).json({ 
                    message: "Error al obtener usuarios",
                    error: result.error
                });
            }

            return res.status(200).json({ users: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Error interno", error: error.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const { userId } = req.params;
            const result = await UserModel.getUserById({ userId });

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
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = req.user.userId
            const validation = validateUpdate(req.body);

            if (!validation.success) {
                return res.status(400).json({ message: JSON.parse(validation.error.message) });
            }

            const result = await UserModel.updateUser({ userId, input: validation.data })

            if (!result.success) {
                return res.status(404).json({ message: result.message });
            }

            return res.status(200).json({ message: result.message });
        } catch (error) {
            return res.status(500).json({
                 message: "Internal Server Error", 
                 error: error.message 
            });
        }
    }
}