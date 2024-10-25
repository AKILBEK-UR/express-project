import { Router, Request, Response } from "express";
import { BlogService } from "./blog.service";
import { blogCreateDtoSchema } from "./dto/blog-create.dto";
import { blogUpdateDtoSchema } from "./dto/blog-update.dto";
import { validateReqBody } from "../../shared/request-body.validator";
import authMiddleware from "../../middleware/authMiddleware";

export const blogRouter = Router();
const blogService = new BlogService();

// Create Blog Post
blogRouter.post(
    "/",
    authMiddleware,
    validateReqBody(blogCreateDtoSchema),
    async (req: Request, res: Response) => {
        const { title, content } = req.body;
        const userId = req.user!.id;

        try {
            const blog = await blogService.createBlog({ title, content, authorId: userId });
            res.status(201).json(blog);
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Error in creating post!" });
        }
    }
);

// Get All Blogs with Pagination
blogRouter.get("/", async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const posts = await blogService.getAllBlogs({ page: +page, limit: +limit });
        res.status(200).json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Error in getting posts!" });
    }
});

// Update Blog Post
blogRouter.put(
    "/:id",
    authMiddleware,
    validateReqBody(blogUpdateDtoSchema),
    async (req: Request, res: Response) => {
        const blogId = req.params.id;
        const { title, content } = req.body;
        const userId = req.user!.id;

        try {
            const updatedBlog = await blogService.updateBlog(blogId, { title, content }, userId);
            res.status(200).json(updatedBlog);
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Error in updating post!" });
        }
    }
);

// Delete Blog Post
blogRouter.delete(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response) => {
        const blogId = req.params.id;
        const userId = req.user!.id;

        try {
            await blogService.deleteBlog(blogId, userId);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Error in deleting post!" });
        }
    }
);
