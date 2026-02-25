import { UserStatus } from "../../../../prisma/generated/enums";
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

    const accessToken = jwtHelper.generateToken({email: user.email, password: user.password}, "abusaiyed", '1d');

    const refreshToken = jwtHelper.generateToken({email: user.email, password: user.password}, "abusaiyedjoy", '30d')

    return {
        accessToken,
        refreshToken
    }
};

export const AuthService = {
    login
}