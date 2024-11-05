import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Blog } from './blog';
import { Comment } from './comment';
import bcrypt from "bcrypt"
import { Like } from './like';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
    id!: string;

  @Column({ unique: true })
    username!: string;

  @Column()
    email!: string;
  
  @Column()
    password!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role!: 'admin' | 'user';

  @OneToMany(() => Blog, (blog) => blog.author)
    blogs!: Blog[];

  @OneToMany(()=> Comment, (comment)=> comment.user, { onDelete: 'CASCADE' })
    comment!: Comment[]

  @OneToMany(() => Like, (like) => like.user)
    like!: Like[];
  
  async hashPassword(password: string):Promise<string> {
    const saltRounds = 10; 
    return bcrypt.hash(password, saltRounds);
  }
}
