import { DataSource } from 'typeorm';
import { BlogService } from '../../../../models/blogs/blog.service';
import { Blog } from '../../../../entities/blog';
import { User } from '../../../../entities/user';
import { Like } from '../../../../entities/like';
import { BlogCreateDto } from '../../../../models/blogs/dto/blog-create.dto';
import { AppDataSource } from '../../../../data-source';

// Configure the test database
beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

// Clear data between tests
// afterEach(async () => {
//   await AppDataSource.getRepository(Blog).clear();
//   await AppDataSource.getRepository(User).clear();
//   await AppDataSource.getRepository(Like).clear();
// });

describe('BlogService', () => {
  const blogService = new BlogService();

  // Test: Creating a Blog
  it('should create a new blog', async () => {
    const user = await AppDataSource.getRepository(User).save({
      username: 'Jony',
      email: 'jony@gmail.com',
      password: 'jony123',
    });

    const newBlog: BlogCreateDto & { authorId: string } = {
      title: 'Test Blog Title',
      content: 'This is a test blog content',
      tags: ['test', 'blog'],
      authorId: user.id,
    };

    const blog = await blogService.createBlog(newBlog);
    expect(blog).toBeDefined();
    expect(blog.title).toBe(newBlog.title);
    expect(blog.author.id).toBe(user.id);
  });

  // Test: Getting All Blogs
  it('should get all blogs with pagination', async () => {
    const user = await AppDataSource.getRepository(User).save({
      username: 'Sati',
      email: 'sati@gmail.com',
      password: 'sati123',
    });

    // Create some blogs
    await blogService.createBlog({
      title: 'Blog 1',
      content: 'Content 1',
      tags: ['tag1'],
      authorId: user.id,
    });
    await blogService.createBlog({
      title: 'Blog 2',
      content: 'Content 2',
      tags: ['tag2'],
      authorId: user.id,
    });

    const blogs = await blogService.getAllBlogs({ page: 1, limit: 2 });
    expect(blogs.blogs.length);
    expect(blogs.total);
  });

  // Test: Updating a Blog
  it('should update a blog if the user is the author', async () => {
    const user = await AppDataSource.getRepository(User).save({
      username: 'Olya',
      email: 'olya@gmail.com',
      password: 'olya123',
    });

    const blog = await blogService.createBlog({
      title: 'Blog to Update',
      content: 'Original content',
      tags: ['tag3'],
      authorId: user.id,
    });

    const updatedBlog = await blogService.updateBlog(
      blog.id,
      { title: 'Updated Title', content: 'Updated Content' },
      user.id,
      'user'
    );

    expect(updatedBlog).toBeDefined();
    expect(updatedBlog?.title).toBe('Updated Title');
  });

  // Test: Deleting a Blog
  it('should delete a blog if the user is the author', async () => {
    const user = await AppDataSource.getRepository(User).save({
      username: 'Banu',
      email: 'banu@gmail.com',
      password: 'banu123',
    });

    const blog = await blogService.createBlog({
      title: 'Blog to Delete',
      content: 'Content to delete',
      tags: ['tag4'],
      authorId: user.id,
    });

    await blogService.deleteBlog(blog.id, user.id, 'user');

    const foundBlog = await AppDataSource.getRepository(Blog).findOneBy({ id: blog.id });
    expect(foundBlog).toBeNull();
  });

  // Test: Liking a Blog
  it('should allow a user to like a blog', async () => {
    const user = await AppDataSource.getRepository(User).save({
      username: 'Datia',
      email: 'datia@gmail.com',
      password: 'datia123',
    });

    const blog = await blogService.createBlog({
      title: 'Blog to Like',
      content: 'Likeable content',
      tags: ['tag5'],
      authorId: user.id,
    });

    const like = await blogService.likeBlog(blog.id, user.id);
    expect(like).toBeDefined();
    expect(like.blog.id).toBe(blog.id);
    expect(like.user.id).toBe(user.id);
  });

  // Test: Unliking a Blog
  it('should allow a user to unlike a blog', async () => {
    const user = await AppDataSource.getRepository(User).save({
      username: 'Azoda',
      email: 'azoda@gmail.com',
      password: 'azoda123',
    });
  
    const blog = await blogService.createBlog({
      title: 'Blog to Unlike',
      content: 'Content to unlike',
      tags: ['tag6'],
      authorId: user.id,
    });
  
    await blogService.likeBlog(blog.id, user.id);
  
    const unlike = await blogService.unlikeBlog(blog.id, user.id);
    expect(unlike).toBeDefined(); 
  
    const likeExists = await AppDataSource.getRepository(Like).findOne({
      where: { blog: { id: blog.id }, user: { id: user.id } }
    });
    expect(likeExists).toBeNull();
  });
  
});
