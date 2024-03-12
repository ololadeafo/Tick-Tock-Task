import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccountDetailDto, LogInDto, SignUpDto } from './auth.controller';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private projectsService: ProjectsService,
        private mailService: MailService, 
        private jwtService: JwtService
        ) {}

    async hashPassword(password: string) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    async createAccessToken(user: User, secret?: string) {
        const payload = { sub: user.id, username: user.username };

        if (secret) {
            return await this.jwtService.signAsync(payload, { 
                secret,
                expiresIn: "10m",
            });
        } else {
            return await this.jwtService.signAsync(payload);
        }
    }

    async signUp(signUpDto: SignUpDto) {
        const usernameExists = (await this.userService.findUserByUsername(signUpDto.username))?.username;
        const emailExists = (await this.userService.findUserByEmail(signUpDto.email))?.email;

        if(usernameExists) {
            throw new BadRequestException('username already exists')
        }

        if(emailExists) {
            throw new BadRequestException('email already exists')
        }
        const hashedPassword = await this.hashPassword(signUpDto.password)
        signUpDto.password = hashedPassword;

        const user = await this.userService.createUser(signUpDto)
        return await this.createAccessToken(user);
    }
    async verifyPassword(enteredPassword: string, existingPassword: string) {
        return await bcrypt.compare(enteredPassword, existingPassword)
    }
    async logIn(logInDto: LogInDto) {
        const user = await this.userService.findUserByUsername(logInDto.username)
        console.log('USER', user)
        if (!user) {
            throw new UnauthorizedException();
        }
        const passwordsMatch = await this.verifyPassword(logInDto.password, user.password);
        if (!passwordsMatch) {
            throw new UnauthorizedException('Incorrect password');
        }
        return await this.createAccessToken(user);
    }

    async changeAccountDetails(accountDetailDto: AccountDetailDto) {
        const user = await this.userService.findUserByUsername (
            accountDetailDto.username,
        );
        
        if (accountDetailDto.field === 'password') {
            const plainTextPassword = accountDetailDto.value;
            const hashedPassword = await this.hashPassword(plainTextPassword);
            user[accountDetailDto.field] = hashedPassword;
        } else {
            user[accountDetailDto.field] = accountDetailDto.value;
        }

        return await this.userService.createUser(user);
    }
    async getProfileData(id: number) {
        const user = await this.userService.findUserById(id);
        return {
            email: user.email,
            name: user.name,
            username: user.username
        }
    }

    async sendResetPasswordEmail(email: string) {
        const user = await this.userService.findUserByEmail(email);

        if (user === null) {
            throw new BadRequestException('email not found');
        }

        const token = await this.createAccessToken(user, user.password)
        return await this.mailService.sendPasswordResetEmail(user, token);
    }

    async saveNewPassword(newPassword: string, id: number, token: string) {
        const user = await this.userService.findUserById(id);
        await this.jwtService.verifyAsync(token, {
            secret: user.password, 
        })
        .catch(() => {
            throw new UnauthorizedException('token is invalid')
        })
        .then(async() => {
            const hashedPassword = await this.hashPassword(newPassword);
            user.password = hashedPassword;
            return await this.userService.createUser(user);
        });
    }

    async deleteUser(id: number) {
        return await this.userService.deleteUser(id);
    }


    async getUserProjects(userId: number) {
        const user = await this.getProfileData(userId);
        const projects = await this.projectsService.getUserProjects(userId);
        console.log('USER', user);
        console.log('PROJECTS', projects);
        return {
            user,
            projects,
        }
    }


    async createProject(name:string, description: string, userId: number) {
        return await this.projectsService.createProject(name, description, userId);
    }
}
