import { Blog } from "./blog";
import { User } from "./user";
import { ManyToOne, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Comment { 
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column('text')
    content!: string

    @ManyToOne(()=> User, (user) => user.comment)
    user!: User

    @ManyToOne(()=> Blog, (blog)=>blog.comment)
    blog!: Blog
}