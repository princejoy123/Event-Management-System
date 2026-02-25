import express, { NextFunction, Request, Response } from "express"
import { UserController } from "./user.controller"
import { userValidationSchema } from "./user.validation";


const router = express.Router()

router.post(
  "/create-user",
  (req: Request, res: Response, next: NextFunction) => {
    req.body =
      userValidationSchema.createUserZodValidationSchema.parse(req.body);

    return UserController.createUser(req, res, next);
  }
);

router.post(
  "/create-host",
  (req: Request, res: Response, next: NextFunction ) => {
    req.body = 
      userValidationSchema.createHostZodValidationSchema.parse(req.body);

      return UserController.createHost(req, res, next)
  }
)

router.post(
  "/create-admin",
  (req: Request, res: Response, next: NextFunction ) => {
    req.body = 
      userValidationSchema.createAdminZodValidationSchema.parse(req.body);

      return UserController.createAdmin(req, res, next)
  }
)

export const userRoutes = router;

