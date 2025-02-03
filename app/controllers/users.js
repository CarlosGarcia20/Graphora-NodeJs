export class userController {
    static async create (req, res) {
        return res.status(200).json({ message: "Creado con éxito" })
    }
}