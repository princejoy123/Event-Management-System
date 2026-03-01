import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import config from "../../config";
import { UserRole, UserStatus } from "../../../../prisma/generated/enums";
import { fileUploader } from "../../Helper/fileUploader";
import { User } from "../../../../prisma/generated/client";

const createUser = async (payload: User, file: Express.Multer.File) => {
  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file)
    payload.profilePhoto = uploadResult?.secure_url as string

  }

  const hashPassword = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_round));

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashPassword,
      profilePhoto: payload.profilePhoto,
      status: UserStatus.ACTIVE
    }
  });

  return user;
};

const getAllUsers = async (req: Request) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await prisma.user.findMany({
    skip,
    take: limit
  });

  const total = await prisma.user.count();

  return { meta: { page, limit, total }, data: users };
};

const getSingleUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  return user;
};

const updateUser = async (id: string, payload: any) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, Number(config.bcrypt_salt_round));
  }

  const user = await prisma.user.update({
    where: { id },
    data: payload
  });

  return user;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({
    where: { id }
  });

  return user;
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
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  createHost,
  createAdmin
};