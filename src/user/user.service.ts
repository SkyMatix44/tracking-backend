import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  /**
   * Login
   */
  async login(email: string, password: string): Promise<string> {
    // const users = await this.userRepo.findByIds([1]);
    // console.log(users);
    return 'Hallo ProPra!!!';
  }

  async register(): Promise<User> {
    const newUser = new User();
    // await this.userRepo.save(newUser);
    return newUser;
  }
}
