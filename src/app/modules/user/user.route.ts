import express, { NextFunction, Request, Response } from "express"
import { UserController } from "./user.controller"
import { userValidationSchema } from "./user.validation";
import { fileUploader } from "../../Helper/fileUploader";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { UserRole } from "../../../../prisma/generated/enums";


const router = express.Router()

router.post(
  "/create-user",
  fileUploader.upload.single('file'),
  validateRequest(userValidationSchema.createUserZodValidationSchema),
  UserController.createUser
);


router.get("/", auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), UserController.getAllUsers);


router.get("/:id", UserController.getSingleUser);


router.patch(
  "/:id",
  validateRequest(userValidationSchema.updateUserZodValidationSchema),
  UserController.updateUser
);


router.delete("/:id", auth(UserRole.ADMIN), UserController.deleteUser);


router.post(
  "/create-host",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(userValidationSchema.createHostZodValidationSchema),
  UserController.createHost
)

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN),
  validateRequest(userValidationSchema.createAdminZodValidationSchema),
  UserController.createAdmin
)

export const userRoutes = router;



