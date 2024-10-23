import { AppDataSource } from "../../data-source";
import { Blog } from "../../entities/blog";
import { User } from "../../entities/user";
import { Comment } from "../../entities/comment";
import { CommentCreateDto } from "./dto/comment-create.dto";
import { CommentUpdateDto } from "./dto/comment-update.dto";

export class CommentService {
    private commentRepository = AppDataSource.getRepository(Comment);

    async createComment(newComment: CommentCreateDto, userId: string, blogId: string): Promise<Comment> {
        const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
        const blog = await AppDataSource.getRepository(Blog).findOneBy({ id: blogId });

        if (!user || !blog) throw new Error("Author or Blog not found!");

        const comment = this.commentRepository.create({
            content: newComment.content,
            user,
            blog
        });
        return this.commentRepository.save(comment);
    }

    async getAllComments(blogId: string): Promise<Comment[]> {
        return this.commentRepository.find({
            where: { blog: { id: blogId } },
            relations: ['user']
        });
    }

    
    async updateComment(commentId: string, newComment: CommentUpdateDto, userId: string): Promise<Comment> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ["user"]
        });

        if (!comment || comment.user.id !== userId) throw new Error("Unauthorized to change or comment not found!");

        comment.content = newComment.content;

        return this.commentRepository.save(comment);
    }

    
    async deleteComment(commentId: string, userId: string): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['user']
        });

        if (!comment) throw new Error("Comment not found!");
        if (comment.user.id !== userId) throw new Error("Not authenticated to delete comment");

        await this.commentRepository.remove(comment); 
    }
}
