import { AppDataSource } from "../../data-source";
import { UserSignUpDto } from "./dto/user-signup.dto";
import { UserLoginDto } from "./dto/user-signin.dto";
import { User } from "../../entities/user";
import bcrypt from "bcrypt"
export class UserService {
    private userRepository = AppDataSource.getRepository(User)

    async signup(newUser: UserSignUpDto):Promise<User>{
        const user = new User();

        const hashedPassword = await user.hashPassword(newUser.password)
        user.username = newUser.username
        user.email = newUser.email
        user.password = hashedPassword
        
        return await this.userRepository.save(user); 
    }

    async signin(newUser: UserLoginDto):Promise<User | null>{
        const email = newUser.email
        
        const user = await this.userRepository.findOneBy({email})
        
        if (!user) {
            throw new Error('User not found');
          }
        const isPasswordValid = await bcrypt.compare(newUser.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        } 
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }
}