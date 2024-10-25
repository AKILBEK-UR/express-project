import { Router, Request, Response } from "express";
import { UserService } from "./user.service";
import { generateToken } from "../../shared/generator.helper";
import { userSignUpDtoSchema } from "./dto/user-signup.dto"
import { userLoginDtoSchema } from "./dto/user-signin.dto";
import { validateReqBody } from "../../shared/request-body.validator";

export const userRouter = Router();
const userService = new UserService();

userRouter.post("/signup",validateReqBody(userSignUpDtoSchema), async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const user = await userService.signup({ username, email, password });
        res.status(201).json({
            message: `New account is created as ${user.username}`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the account." });
    }
});


userRouter.post('/login',validateReqBody(userLoginDtoSchema), async (req: Request, res: Response) => {

    try {
      const { email, password } = req.body;
      const user = await userService.signin({email, password});
  
      if (user) {
        const token = generateToken(user.id);
        res.status(200).json({
          message: `User is logged in by ${user.email}`,
          token: token,
        });
      } else {
         res.status(401).json({message: 'Error occured!'});
      }
    } catch (error:any) {
        res.status(500).json({
          message: 'An error occurred while logging in!',
          error: error.message,
      });
    }
  });

  userRouter.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while fetching users.",
            error: error.message,
        });
    }
});
