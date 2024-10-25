import { Router, Request, Response } from "express";
import { UserService } from "./user.service";
import { generateToken } from "../../shared/generator.helper";
import { userSignUpDtoSchema } from "./dto/user-signup.dto"
import { userLoginDtoSchema } from "./dto/user-signin.dto";
import { validateReqBody } from "../../shared/request-body.validator";
import { roleMiddleware } from "../../middleware/role.middleware";
import authMiddleware from "../../middleware/auth.middleware";
export const userRouter = Router();
const userService = new UserService();

userRouter.post("/signup",authMiddleware,validateReqBody(userSignUpDtoSchema),async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        try {
            const user = await userService.signup({ username, email, password });
            res.status(201).json({
                message: `New account is created as ${user.username}`,
            });
        } catch (error: any) {
            res.status(500).json({
                message: "An error occurred while creating the account.",
                error: error.message,
            });
        }
    }
);

userRouter.post('/login',validateReqBody(userLoginDtoSchema), async (req: Request, res: Response) => {

    try {
      const { email, password } = req.body;
      const user = await userService.signin({email, password});
  
      if (user) {
        const token = generateToken(user.id,user.role);
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

userRouter.get("/users",authMiddleware,roleMiddleware(['admin']), async (req: Request, res: Response) => {
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

userRouter.post("/users/:id/promote", authMiddleware, roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
      const userId = req.params.id;
      const user = await userService.promoteUser(userId);
      res.status(200).json({
          message: `User ${user.username} has been promoted to admin.`,
      });
  } catch (error: any) {
      res.status(500).json({
          message: 'Error occurred while promoting user.',
          error: error.message,
      });
  }
});

userRouter.post("/users/:id/demote", authMiddleware, roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
      const userId = req.params.id;
      const user = await userService.demoteUser(userId);
      res.status(200).json({
          message: `User ${user.username} has been demoted to regular user.`,
      });
  } catch (error: any) {
      res.status(500).json({
          message: 'Error occurred while demoting user.',
          error: error.message,
      });
  }
});

userRouter.delete("/:id", authMiddleware, roleMiddleware(['admin']), async (req: Request, res: Response) => {
  try {
      const userId = req.params.id;
      await userService.deleteUser(userId);
      res.status(200).json({
          message: `User with ID ${userId} has been deleted.`,
      });
  } catch (error: any) {
      res.status(500).json({
          message: 'Error occurred while deleting user.',
          error: error.message,
      });
  }
});

userRouter.get("/profile/view",authMiddleware, async (req: Request, res: Response) => {
    try{
        const userId = req.user!.id
        const user = await userService.viewProfile(userId)
        res.status(200).json(user)
    }catch(error:any){
        res.status(500).json({
            message: "Error in fetching user Profile",
            error: error.message,
        }) 
    }
})


userRouter.post("/profile/update",authMiddleware,async (req: Request, res: Response) =>{
    try{
        const userId = req.user!.id
        const updateData = req.body
        const user = await userService.updateUser(userId,updateData)
        res.status(200).json(user)
    }catch(error:any){
        res.status(500).json({
            message: "Error in updating profile.",
            error: error.message,
        })
    }
})