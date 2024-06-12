import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { URLSearchParams } from "url";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are mandatory");

    return next(error);
  }

  //Database call

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User already exist with this email.");
      return next(error);
    }
  } catch (err) {
    return next(createHttpError(500, "Error while getting the user"));
  }

  //password hash

  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;

  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while creating the user"));
  }

  //Token generation JWT

  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    res.status(200).json({
      accessToken: token,
    });
  } catch (err) {
    return next(createHttpError(500, "Error while signing the jwt token"));
  }
};
export { createUser };
