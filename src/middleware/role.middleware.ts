// import { Request, Response, NextFunction } from "express";

// export const checkRole = (role: string) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const user = req.user;
//     if (!user || user.role !== role) {
//       return res.status(403).json({ message: "Access denied." });
//     }
//     next();
//   };
// };
