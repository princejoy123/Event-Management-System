import jwt from "jsonwebtoken";
import httpStatus from "http-status-codes";
import config from "../config";
import { NextFunction, Response } from "express";
import ApiError from "../errors/ApiErrors";

 const auth = (...requiredRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    try {
      let token;

      if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
      }

      else if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const decoded = jwt.verify(
        token,
        config.jwt.jwt_secret!
      ) as any;

      req.user = decoded;

      if (
        requiredRoles.length &&
        !requiredRoles.includes(decoded.role)
      ) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden access");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;