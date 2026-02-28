import express, { NextFunction, Request, Response } from "express"
import { UserController } from "./user.controller"
import { userValidationSchema } from "./user.validation";
import { fileUploader } from "../../Helper/fileUploader";


const router = express.Router()

router.post(
  "/create-user",
  fileUploader.upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body =
      userValidationSchema.createUserZodValidationSchema.parse(JSON.parse(req.body.data));

    return UserController.createUser(req, res, next);
  }
);


router.get("/", UserController.getAllUsers);


router.get("/:id", UserController.getSingleUser);


router.patch(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidationSchema.updateUserZodValidationSchema.parse(req.body);
    return UserController.updateUser(req, res, next);
  }
);


router.delete("/:id", UserController.deleteUser);


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



