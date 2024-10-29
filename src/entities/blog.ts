import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user';
import { Comment } from './comment';
import { Like } from './like';
@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column("simple-array",{nullable:true})
  tags!:string[]

  @OneToMany(()=>Like, (like) => like.blog)
  likes!:Like[]

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  author!: User;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comment!: Comment[]
}
