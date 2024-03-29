import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/auth/auth.controller';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    users: any
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async findUserById(id: number) {
        return await this.userRepository.findOneBy({ id });
    }

    async findUserByUsername(username: string) {
        return await this.userRepository.findOneBy({ username });
    }

    async findUserByEmail(email: string) {
        return await this.userRepository.findOneBy({ email });
    }


    async createUser(user: SignUpDto) {
        return await this.userRepository.save({ ...user })
    }

    async deleteUser(id: number) {
        return await this.userRepository.delete(id);
    }
}
