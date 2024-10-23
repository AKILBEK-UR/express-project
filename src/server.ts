import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import { userRouter } from './models/user/user.controller';
import { blogRouter } from './models/blogs/blog.controller';
import { commentRouter } from './models/comment/comment.controller';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000/auth/signup',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions)); 

app.use('/auth', userRouter);
app.use("/blog", blogRouter);
app.use("/comment", commentRouter)
app.options('*', cors(corsOptions));
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => console.log('Database connection error: ', error));