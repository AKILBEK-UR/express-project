import { AppDataSource } from "../../data-source";
import { UserSignUpDto } from "./dto/user-signup.dto";
import { UserLoginDto } from "./dto/user-signin.dto";
import { User } from "../../entities/user";
import bcrypt from "bcrypt"
export class UserService {
    private userRepository = AppDataSource.getRepository(User)

    async signup(newUser: UserSignUpDto):Promise<User>{
        const user = new User();
        if(!newUser) throw new Error("lll")
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

    async promoteUser(userId: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        user.role = 'admin';
        return await this.userRepository.save(user);
    }

    async demoteUser(userId: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        user.role = 'user';
        return await this.userRepository.save(user);
    }

    async deleteUser(userId: string): Promise<void> {
        await this.userRepository.delete(userId);
    }

    async viewProfile(userId:string): Promise<User| null> {
        const user =  this.userRepository.findOne({where: {id: userId}})
        if(!user) throw new Error("User not found.")
        return user;
    }

    async updateUser(userId: string, updateData:Partial<User>): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if(!user) throw new Error("User not found.");

        if(updateData.username) user.username = updateData.username;
        if(updateData.email) user.email = updateData.email

        return await this.userRepository.save(user);
    }
}