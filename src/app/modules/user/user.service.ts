import { Request } from "express";
import bcrypt from "bcryptjs"
import { prisma } from "../../shared/prisma";
import config from "../../config";
import { UserRole } from "../../../../prisma/generated/enums";


const createUser = async (req: Request) => {
    const hashPassword = await bcrypt.hash(req.body.password, config.bcrypt_salt_round)


    const result = await prisma.user.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        }
    })

    return result
};

const createHost = async (req: Request) => {
    const hashPassword = await bcrypt.hash(
        req.body.password,
        config.bcrypt_salt_round
    );

    const result = await prisma.$transaction(async (tnx) => {

        const user = await tnx.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                role: UserRole.HOST
            }
        });

        const host = await tnx.host.create({
            data: {
                userId: user.id
            }
        });

        return host;
    });

    return result;
};

const createAdmin = async (req: Request) => {
    const hashPassword = await bcrypt.hash(
        req.body.password,
        config.bcrypt_salt_round
    );

    const result = await prisma.$transaction(async (tnx) => {

        const isUserExist = await tnx.user.findUnique({
            where: { email: req.body.email }
        });

        if (isUserExist) {
            throw new Error("User already exists with this email");
        }

        const user = await tnx.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                role: UserRole.ADMIN
            }
        });

        const admin = await tnx.admin.create({
            data: {
                userId: user.id,
                contactNumber: req.body.contactNumber
            }
        });

        return admin;
    });

    return result;
};

export const UserService = {
    createUser,
    createHost,
    createAdmin
};