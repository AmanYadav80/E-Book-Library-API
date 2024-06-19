import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors"

const app=express();

app.use(express.json());

app.use(cors());

//Routes
app.get('/', (req,res,next)=>{
    res.json({message:"Welcome to ebook api's"});
});

app.use('/api/users',userRouter);

app.use('/api/books',bookRouter);

//global error handler
app.use(globalErrorHandler);


export default app;