import { ManyToOne, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Blog } from "./blog";


@Entity()
export class Like {
    @PrimaryGeneratedColumn('uuid')
    id!:string

    @ManyToOne(()=>User, (user) => user.like, { onDelete: 'CASCADE' })
    user!: User

    @ManyToOne(()=>Blog, (blog)=> blog.likes, {onDelete: 'CASCADE'})
    blog!: Blog
}