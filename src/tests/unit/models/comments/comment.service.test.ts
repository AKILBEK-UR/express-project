import { AppDataSource } from "../../../../data-source";
import { CommentService } from "../../../../models/comment/comment.service";
import { User } from "../../../../entities/user";
import { Blog } from "../../../../entities/blog";
import { Comment } from "../../../../entities/comment";
import { CommentCreateDto } from "../../../../models/comment/dto/comment-create.dto";
import { CommentUpdateDto } from "../../../../models/comment/dto/comment-update.dto";

describe('CommentService', () => {
    let commentService: CommentService;
    let user: User;
    let blog: Blog;

    beforeAll(async () => {
        await AppDataSource.initialize();
        commentService = new CommentService();
        user = await AppDataSource.getRepository(User).save({
            username: 'Miron',
            email: 'miron@gmail.com',
            password: 'miron123',
        });

        blog = await AppDataSource.getRepository(Blog).save({
            title: 'Test Blog',
            content: 'Test content',
            authorId: user.id,
            tags: ['test'],
        });
    });

    afterAll(async () => {
        await AppDataSource.getRepository(Comment).clear();
        await AppDataSource.getRepository(Blog).remove(blog);
        await AppDataSource.getRepository(User).remove(user);
        await AppDataSource.destroy();
    });

    it('should create a comment', async () => {
        const newComment: CommentCreateDto = { content: 'This is a test comment' };
        const comment = await commentService.createComment(newComment, user.id, blog.id);

        expect(comment).toBeDefined();
        expect(comment.content).toBe(newComment.content);
        expect(comment.user.id).toBe(user.id);
        expect(comment.blog.id).toBe(blog.id);
    });

    it('should retrieve all comments for a blog', async () => {
        const firstComment: CommentCreateDto = { content: 'This is a test comment' };
        await commentService.createComment(firstComment, user.id, blog.id); // Create first comment
        const comments = await commentService.getAllComments(blog.id);
    
        expect(comments).toBeDefined();
        expect(comments[0].content).toBe(firstComment.content);
    });
    

    it('should update a comment', async () => {
        const newComment: CommentCreateDto = { content: 'This comment will be updated' };
        const comment = await commentService.createComment(newComment, user.id, blog.id);

        const updatedCommentDto: CommentUpdateDto = { content: 'Updated content' };
        const updatedComment = await commentService.updateComment(comment.id, updatedCommentDto, user.id);

        expect(updatedComment).toBeDefined();
        expect(updatedComment.content).toBe(updatedCommentDto.content);
    });

    it('should delete a comment', async () => {
        const newComment: CommentCreateDto = { content: 'This comment will be deleted' };
        const comment = await commentService.createComment(newComment, user.id, blog.id);

        await commentService.deleteComment(comment.id, user.id);

        const deletedComment = await AppDataSource.getRepository(Comment).findOneBy({ id: comment.id });
        expect(deletedComment).toBeNull();
    });

    it('should throw an error when trying to delete a comment that does not exist', async () => {
        const invalidId = '00000000-0000-0000-0000-000000000000'; // use a UUID that is not in the database
        await expect(commentService.deleteComment(invalidId, user.id)).rejects.toThrow('Comment not found!');
    });

    it('should throw an error when a user tries to delete a comment they did not create', async () => {
        const newUser = await AppDataSource.getRepository(User).save({
            username: 'Tima',
            email: 'tima@gmail.com',
            password: 'tima123',
        });

        const newComment: CommentCreateDto = { content: 'Comment from another user' };
    const comment = await commentService.createComment(newComment, newUser.id, blog.id);

    await expect(commentService.deleteComment(comment.id, user.id)).rejects.toThrow('Not authenticated to delete comment');

    // Cleanup after test
    await AppDataSource.getRepository(Comment).remove(comment); // Remove the comment created by newUser
    await AppDataSource.getRepository(User).remove(newUser); // Remove the new user
    });
});
