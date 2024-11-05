import { ILike } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Blog } from '../../entities/blog';
import { User } from '../../entities/user';
import { BlogCreateDto } from './dto/blog-create.dto';
import { BlogGetAllDto } from './dto/blog-getAll.dto';
import { BlogUpdateDto } from './dto/blog-update.dto';
import { Like } from '../../entities/like';
export class BlogService {
    private blogRepository = AppDataSource.getRepository(Blog);
    private likeRepository = AppDataSource.getRepository(Like)
    private userRepository = AppDataSource.getRepository(User)

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
            {content: ILike(`%${searchQuery}%`)},
            {tags: ILike(`%${searchQuery}%`)}
        ]:[];


        const [blogs, total] = await this.blogRepository.findAndCount({
            relations: ['author', 'comment',"likes"], // Load the author relation
            where: param, 
            take: limit,
            skip: (page - 1) * limit,
        });
        return { blogs, total, page, limit };
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
    async likeBlog(blogId: string, userId:string) {
        const blog = await this.blogRepository.findOneBy({id:blogId})
        const user = await this.userRepository.findOneBy({id:userId})

        if (!blog) throw new Error("Blog not found");
        if (!user) throw new Error("User not found");

        const alreadyLiked = await this.likeRepository.findOne({where: {blog,user}})
        if(alreadyLiked) throw new Error("Already liked blog")

        const like = this.likeRepository.create({blog,user})
        return this.likeRepository.save(like)
    }

    //Unlike the blog
    async unlikeBlog(blogId:string, userId:string) {
        const blog = await this.blogRepository.findOneBy({id:blogId})
        const user = await this.userRepository.findOneBy({id:userId})

        if(!blog) throw new Error("Blog not found");
        if (!user) throw new Error("User not found");

        const like = await this.likeRepository.findOne({
            where: {
                blog: { id: blogId },
                user: { id: userId },
            },
        });

        if (!like) throw new Error("Not liked before");
        
        return await this.likeRepository.remove(like)
    }
}
