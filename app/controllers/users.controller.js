import { UserModel } from "../models/users.models.js";

export class userController {
    static async create(req, res) {
        try {
            const { name, lastName, email, password, rememberMe } = req.body;

            const result = await UserModel.createUser({ name, lastName, email, password, rememberMe });
            
            if (!result.success) {
                return res.status(500).json({ message: result.error.message });
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
                return res.status(500).json({ message: "Error al obtener usuarios" });
            }

            return res.status(200).json({ users: result.data });
        } catch (error) {
            return res.status(500).json({ message: "Error interno", error: error.message });
        }
    }
}