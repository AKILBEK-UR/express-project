import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export function validateReqBody(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedBody = schema.parse(req.body);
      req.body = parsedBody;
      next();  
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        res.status(400).json({
          message: "Bad Request",
          errors: errorMessages,
        });
        return;  
      }
      res.status(500).json({
        message: "Internal Server Error",
        errors: ["An unexpected error occurred"],
      });
      return;
    }
  };
}
