import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Blog } from './blog';
import bcrypt from "bcrypt"
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

  @OneToMany(() => Blog, (blog) => blog.author)
    blogs!: Blog[];

  @Column({ default: 'user' })
    role!: string;
  
  async hashPassword(password: string):Promise<string> {
    const saltRounds = 10; 
    return bcrypt.hash(password, saltRounds);
  }
}
