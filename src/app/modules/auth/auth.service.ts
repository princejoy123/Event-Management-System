import { UserStatus } from "../../../../prisma/generated/enums";
import config from "../../config";
import { jwtHelper } from "../../Helper/jwtHelper";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs"

const login = async ( payload: {email: string, password: string}) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if(!isCorrectPassword){
        throw new Error("Password doesn't match")
    }

    const accessToken = jwtHelper.generateToken({id: user.id, email: user.email, password: user.password, role: user.role}, config.jwt.jwt_secret!, config.jwt.jwt_expiresin!);

    const refreshToken = jwtHelper.generateToken({email: user.email, password: user.password, role: user.role}, config.jwt.jwt_refresh_secret!, config.jwt.jwt_refresh_expiresin!)

    return {
        accessToken,
        refreshToken
    }
};

export const AuthService = {
    login
}