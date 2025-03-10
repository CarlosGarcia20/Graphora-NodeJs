import { loginModel } from "../models/login.models.js";
import { validateLogin } from "../schemas/login.js";

export class loginController {
    static async login (req, res) {
        try {
            const resultado = validateLogin(req.body);
           
            if (!resultado.success) {
                return res.status(400).json({ message: JSON.parse(resultado.error.message) });
            }

            const result = await loginModel.login({ input: resultado.data });
           
            if (!result.success) {
                return res.status(500).json({ message: result.message });
            }

            const { iduser,email, name, lastname } = result.data;
            
            return res.status(200).json({ message: "Inicio de sesión exitoso", data: { iduser, email, name, lastname } });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
}