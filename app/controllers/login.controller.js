import { loginModel } from "../models/login.models.js";

export class loginController {
    static async login (req, res) {
        try {
            const { email, password } = req.body;
            const result = await loginModel.login({ email, password });

            console.log(result)

            if (!result.success) {
                return res.status(500).json({ message: result.message });
            }
            
            return res.status(200).json({ message: "Inicio de sesión exitoso", data: result.data })
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
}