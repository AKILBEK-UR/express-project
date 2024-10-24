import { ILike, Like } from 'typeorm';
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
            author,
            tags:newBlog.tags
        });

        return this.blogRepository.save(blog);
    }

    // Get all blogs with pagination
    async getAllBlogs(pagination: BlogGetAllDto, searchQuery?:string) {
        const { page, limit } = pagination;

        const param = searchQuery
        ? [
            {title: ILike(`%${searchQuery}%`)},
            {content: Like(`%${searchQuery}%`)},
            {tags: Like(`%${searchQuery}%`)}
        ]:[];


        const [posts, total] = await this.blogRepository.findAndCount({
            relations: ['author', 'comment'], // Load the author relation
            where: param, 
            take: limit,
            skip: (page - 1) * limit,
        });
        return { posts, total, page, limit };
    }

    // Update a blog if the user is the author
    async updateBlog(blogId: string, newBlog: BlogUpdateDto, userId: string, userRole: string): Promise<Blog | null> {
        const blog = await this.blogRepository.findOne({
            where: { id: blogId },
            relations: ['author'],
        });

        if (!blog) {
            throw new Error("Blog not found");
        }

        if (blog.author.id !== userId && userRole !== 'admin') {
            throw new Error('Unauthorized');
        }
        

        blog.title = newBlog.title;
        blog.content = newBlog.content;

        return this.blogRepository.save(blog);
    }

    // Delete a blog if the user is the author
    async deleteBlog(blogId: string, userId: string, userRole: string): Promise<void> {
        const blog = await this.blogRepository.findOne({
            where: { id: blogId },
            relations: ['author'], 
        });
        
        if (!blog) {
            throw new Error("Blog not found!");
        }

        if (blog.author.id !== userId && userRole !== 'admin') {
            throw new Error('Unauthorized');
        }

        await this.blogRepository.remove(blog);
    }

    //Like the post
    async likeBlog(blogId: string) {
        const blog = await this.blogRepository.findOneBy({id:blogId})

        if (!blog) throw new Error("Blog not found");

        blog.likes = (blog.likes || 0) + 1;
        return this.blogRepository.save(blog);
    }

    //Unlike the blog
    async unlikeBlog(blogId:string) {
        const blog = await this.blogRepository.findOneBy({id:blogId})

        if(!blog) throw new Error("Blog not found");

        blog.likes = Math.max((blog.likes || 1) - 1, 0);
        return this.blogRepository.save(blog);
    }
}
