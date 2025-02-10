import bcrypt from "bcrypt"

const saltRound = 10;

export class EncryptionHelper {
    static async hashPassword(password) {
        return await bcrypt.hash(password, saltRound);
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}