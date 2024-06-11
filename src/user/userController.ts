import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { URLSearchParams } from "url";

const createUser = async (req: Request,res: Response,next: NextFunction) => {

    const { name, email, password } = req.body;

     if(!name || !email || !password) {

        const error = createHttpError(400,'All fields are mandatory');

        return next(error);

     }

     //Database call

     const user = await userModel.findOne({ email });
     if(user) {
        const error = createHttpError(400,"User already exist with this email.");
        return next(error);
     }

     //password hash

     const hashedPassword = await bcrypt.hash(password,10);

     const newUser = await userModel.create({
        name,
        email,
        password : hashedPassword,
     });

     //Token generation
     


    res.status(200).json({
        message:"User created",
    });
};

export { createUser };