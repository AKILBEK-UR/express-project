import { Router, Request, Response } from "express";
import { CommentService } from "./comment.service";
import { createCommentDtoSchema } from "./dto/comment-create.dto";
import { commentUpdateDtoSchema } from "./dto/comment-update.dto";
import { validateReqBody } from "../../shared/request-body.validator";
import authMiddleware from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";

export const commentRouter = Router();
const commentService = new CommentService();


commentRouter.post("/:id", validateReqBody(createCommentDtoSchema), authMiddleware, async (req: Request, res: Response) => {
    const newComment = req.body;
    const userId = req.user!.id;
    const blogId = req.params.id;

    try {
        const comment = await commentService.createComment(newComment, userId, blogId);
        res.status(201).json(comment);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Error in creating comment!" });
    }
});


commentRouter.get("/:id", authMiddleware, roleMiddleware(['admin']), async (req: Request, res: Response) => {
    try {
        const blogId = req.params.id;
        const comments = await commentService.getAllComments(blogId);
        res.status(200).json(comments);
    } catch (error: any) {
        res.status(500).json({
            message: "Error in fetching comments!",
            error: error.message
        });
    }
});


commentRouter.put("/:commentId", authMiddleware, roleMiddleware(['admin', 'user']), validateReqBody(commentUpdateDtoSchema), async (req: Request, res: Response) => {
    const { commentId } = req.params; 
    const userId = req.user?.id;
    const { content } = req.body;

    try {
        const updateComment = await commentService.updateComment(commentId, { content }, userId);
        res.status(200).json(updateComment);
    } catch (error: any) {
        res.status(500).json({
            message: "Error in updating!",
            error: error.message
        });
    }
});


commentRouter.delete("/:commentId", authMiddleware, roleMiddleware(['admin', 'user']), async (req: Request, res: Response) => {
    const { commentId } = req.params; 
    const userId = req.user!.id; 

    try {
        await commentService.deleteComment(commentId, userId);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({
            message: "Error in deleting!",
            error: error.message
        });
    }
});
