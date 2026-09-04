import { createApp } from "./app.js";

import { LoginModel } from "./app/models/postgresql/auth.models.js";
import { DiagramModel } from "./app/models/postgresql/diagram.model.js";
import { UserModel } from "./app/models/postgresql/users.models.js";
import { TokenModel } from "./app/models/postgresql/token.model.js";

import { TokenService } from "./app/services/tokenService.js";

const tokenService = new TokenService()

const models = {
    loginModel: new LoginModel(),
    userModel: new UserModel(),
    diagramModel: new DiagramModel(),
    tokenModel: new TokenModel()
}
    
const app = createApp({
    models,
    services: { tokenService }
})