import { AppDataSource } from '../../data-source';
import { Blog } from '../../entities/blog';
import { User } from '../../entities/user';
import { BlogCreateDto } from './dto/blog-create.dto';
import { BlogGetAllDto } from './dto/blog-getAll.dto';
import { BlogUpdateDto } from './dto/blog-update.dto';

export class BlogService {
    private blogRepository = AppDataSource.getRepository(Blog);

    // Create a new blog post
    async createBlog(newBlog: BlogCreateDto & {authorId:string}): Promise<Blog> {
        const author = await AppDataSource.getRepository(User).findOneBy({ id: newBlog.authorId });
        if (!author) throw new Error('Author not found');

        const blog = this.blogRepository.create({
            title: newBlog.title,
            content: newBlog.content,
            author,  // The User entity as a relation
        });

        return this.blogRepository.save(blog);
    }

    // Get all blogs with pagination
    async getAllBlogs(pagination: BlogGetAllDto) {
        const { page, limit } = pagination;
        const [posts, total] = await this.blogRepository.findAndCount({
            relations: ['author'], // Load the author relation
            take: limit,
            skip: (page - 1) * limit,
        });
        return { posts, total, page, limit };
    }

    // Update a blog if the user is the author
    async updateBlog(blogId: string, newBlog: BlogUpdateDto, userId: string): Promise<Blog | null> {
        const blog = await this.blogRepository.findOne({
            where: { id: blogId },
            relations: ['author'],
        });

        if (!blog) {
            throw new Error("Blog not found");
        }
        console.log("Blog Author ID:", blog.author.id);
        console.log("User ID:", userId);

        if (blog.author.id !== userId) {
            console.error(`Unauthorized access. User ID: ${userId}, Blog Author ID: ${blog.author.id}`);
            throw new Error("Unauthorized");
        }

        blog.title = newBlog.title;
        blog.content = newBlog.content;

        return this.blogRepository.save(blog);
    }

    // Delete a blog if the user is the author
    async deleteBlog(blogId: string, userId: string): Promise<void> {
        const blog = await this.blogRepository.findOne({
            where: { id: blogId },
            relations: ['author'], // Load the author relation
        });
        
        if (!blog) {
            throw new Error("Blog not found!");
        }

        if (blog.author.id !== userId) {
            throw new Error('Unauthorized');
        }

        await this.blogRepository.remove(blog);
    }
}
