import { NextFunction, Request, Response } from "express"
import { jwtHelper } from "../Helper/jwtHelper"
import config from "../config"


const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
        });
      }

      const verifiedUser = jwtHelper.verifyToken(
        token,
        config.jwt.jwt_secret as string
      );

      req.user = verifiedUser;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;