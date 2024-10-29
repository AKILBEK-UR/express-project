import { DataSource } from 'typeorm';
import { User } from './entities/user';
import { Blog } from './entities/blog';
import { Comment } from './entities/comment';
import { Like } from './entities/like';
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: `postgres://postgres:akilbek2003@localhost:5432/express`,
  entities: [User,Blog,Comment,Like],
  logging:true,
  synchronize: true,
});
