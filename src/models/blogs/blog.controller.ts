import { Router, Request, Response } from "express";
import { BlogService } from "./blog.service";
import { blogCreateDtoSchema } from "./dto/blog-create.dto";
import { blogUpdateDtoSchema } from "./dto/blog-update.dto";
import { validateReqBody } from "../../shared/request-body.validator";
import authMiddleware from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";
export const blogRouter = Router();
const blogService = new BlogService();

// Create Blog Post
blogRouter.post(
    "/",
    authMiddleware,
    roleMiddleware(['user']),
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
blogRouter.get("/",authMiddleware,roleMiddleware(['admin']), async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search } = req.query;

    try {
        const posts = await blogService.getAllBlogs(
            { page: +page, limit: +limit },
            search ? String(search) : undefined
        );
        res.status(200).json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Error in getting posts!" });
    }
});

// Update Blog Post
blogRouter.put("/:id",authMiddleware,roleMiddleware(['admin', 'user']),validateReqBody(blogUpdateDtoSchema),async (req: Request, res: Response) => {
        const blogId = req.params.id;
        const { title, content } = req.body;
        const userId = req.user!.id;
        const userRole = req.user!.role;
        try {
            const updatedBlog = await blogService.updateBlog(blogId, { title, content }, userId, userRole);
            res.status(200).json(updatedBlog);
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Error in updating post!" });
        }
    }
);

// Delete Blog Post
blogRouter.delete("/:id",authMiddleware,roleMiddleware(['admin', 'user']),async (req: Request, res: Response) => {
        const blogId = req.params.id;
        const userId = req.user!.id;
        const userRole = req.user!.role; 
        try {
            await blogService.deleteBlog(blogId, userId, userRole);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message || "Error in deleting post!" });
        }
    }
);


//Like the blog
blogRouter.post("/:id/like", async (req:Request, res:Response) =>{
    const blogId = req.params.id;
    try{
        const blog = await blogService.likeBlog(blogId);
        res.status(200).json(blog)
    }catch(error:any){
        res.status(500).json({ message: error.message || "Error in liking the blog post!" });
    }
})

//Unlike the blog
blogRouter.post("/:id/unlike", async (req:Request, res:Response) => {
    const blogId = req.params.id;

    try{
        const blog = await blogService.unlikeBlog(blogId);
        res.status(200).json(blog);
    }catch(error:any){
        res.status(500).json({ message: error.message || "Error in liking the blog post!" });
    }
})