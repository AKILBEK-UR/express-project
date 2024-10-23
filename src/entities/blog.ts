import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user';
import { Comment } from './comment';
@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  author!: User;

  @OneToMany(() => Comment, (comment) => comment.blog)
    comment!: Comment[]
}
