import { DataSource } from 'typeorm';
import { User } from './entities/user';
import { Blog } from './entities/blog';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: `postgres://postgres:akilbek2003@localhost:5432/express`,
  entities: [User,Blog],
  logging:true,
  synchronize: true,
});
