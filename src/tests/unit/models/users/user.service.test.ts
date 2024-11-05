import { UserService } from "../../../../models/user/user.service";
import { AppDataSource } from "../../../../data-source";
import { User } from "../../../../entities/user";

describe("UserService Integration Tests", () => {
    let userService: UserService;

    beforeAll(async () => {
        userService = new UserService();
        await AppDataSource.initialize(); 
    });

    afterAll(async () => {
        await AppDataSource.destroy(); 
    });

   
    

    test("should sign up a user successfully", async () => {
        const newUser = { username: "Said", email: "said1606@gmail.com", password: "said123" };
        const result = await userService.signup(newUser);
        
        expect(result.username).toBe(newUser.username);
        expect(result.email).toBe(newUser.email);
        expect(result.password).not.toBe(newUser.password); 
    });

    test("should sign in a user successfully", async () => {
        const newUser = { username: "Ravshan", email: "ravshan1606@gmail.com", password: "ravsh123" };
        await userService.signup(newUser);
        const result = await userService.signin({ email: newUser.email, password: newUser.password });
        if(!result) throw new Error("Email error.")
        expect(result.email).toBe(newUser.email);
    });

    test("should throw error for invalid credentials", async () => {
        const email = "ravshan1606@gmail.com";
        const password = "wrongpassword";

        await expect(userService.signin({ email, password })).rejects.toThrow("Invalid credentials");
    });

    test("should fetch all users successfully", async () => {
        const users = [
            { username: "Vadim", email: "vadim1606@gmail.com", password: "vadim123" },
            { username: "Amal", email: "amal1606@gmail.com", password: "amal123" },
        ];
        await Promise.all(users.map(user => userService.signup(user))); 

        const result = await userService.getAllUsers();
        expect(result.length);
    });

    test("should promote a user successfully", async () => {
        const newUser = { username: "Atabek", email: "atabek1606@gmail.com", password: "atabek1606" };
        const user = await userService.signup(newUser); 

        const result = await userService.promoteUser(user.id);
        expect(result.role).toBe("admin");
    });

    test("should throw error if user to promote not found", async () => {
        const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d471";
        await expect(userService.promoteUser(userId)).rejects.toThrow("User not found");
    });

    test("should demote a user successfully", async () => {
        const newUser = { username: "Asl", email: "asl1606@gmail.com", password: "asl123" };
        const user = await userService.signup(newUser); 
        await userService.promoteUser(user.id);

        const result = await userService.demoteUser(user.id);
        expect(result.role).toBe("user");
    });

    test("should throw error if user to demote not found", async () => {
        const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d472";
        await expect(userService.demoteUser(userId)).rejects.toThrow("User not found");
    });

    test("should delete a user successfully", async () => {
        const newUser = { username: "Jack", email: "jack1606@gmail.com", password: "jack123" };
        const user = await userService.signup(newUser); 
        const old_list = await userService.getAllUsers();
        await userService.deleteUser(user.id);
        const allUsers = await userService.getAllUsers();
        expect(allUsers.length !== old_list.length).toBe(true); 
    });

    test("should fetch user profile successfully", async () => {
        const newUser = { username: "Merok", email: "merok1606@gmail.com", password: "merok123" };
        const user = await userService.signup(newUser); 

        const result = await userService.viewProfile(user.id);
        expect(result.username).toBe(user.username);
    });

    test("should throw error if user profile not found", async () => {
        const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d473";
        await expect(userService.viewProfile(userId)).rejects.toThrow("User not found.");
    });

    test("should update user profile successfully", async () => {
        const newUser = { username: "Dava", email: "dava1606@gmail.com", password: "dava123" };
        const user = await userService.signup(newUser); 

        const updateData = { username: "newuser" };
        const result = await userService.updateUser(user.id, updateData);
        expect(result.username).toBe("newuser");
    });

    test("should throw error if user to update not found", async () => {
        const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d474";
        const updateData = { username: "newuser" };
        await expect(userService.updateUser(userId, updateData)).rejects.toThrow("User not found.");
    });
});
