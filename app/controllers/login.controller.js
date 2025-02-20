import { loginModel } from "../models/login.models.js";

export class loginController {
    static async login (req, res) {
        try {
            console.log("Entro");
            const { email, password, rememberMe } = req.body;
            const result = await loginModel.login({ email, password, rememberMe });

            if (!result.success) {
                return res.status(500).json({ message: result.message });
            }
            console.log(result);

            const data = (({ iduser, email, name, lastname }) => ({ iduser, email, name, lastname }))(result);
            
            return res.status(200).json({ message: "Inicio de sesión exitoso", data: data })
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }
}