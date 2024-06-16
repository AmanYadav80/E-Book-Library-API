import { NextFunction, Request, Response } from "express";
import path from "node:path";
import fs from "node:fs";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    //image upload
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });
    //book pdf upload
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    const newBook = await bookModel.create({
        title,
        genre,
        author:'6669d2425fb8ccb6b820961e',
        coverImage : uploadResult.secure_url,
        file : bookFileUploadResult.secure_url
    });

    //Delete temporary files
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ id : newBook._id });

  } catch {
    return next(createHttpError(500, "Error uploading the file"));
  }
  res.json({
    message: "Book created",
  });
};

export { createBook };
