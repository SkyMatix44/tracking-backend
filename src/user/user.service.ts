import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user';

@Injectable()
export class UserService {
  userRepo: Repository<User>;

  // constructor(userRepo: Repository<User>) {
  //   this.userRepo = userRepo; // TODO ? + import module
  // }

  /**
   * Login
   */
  login(email: string, password: string): string {
    const user: User = new User();
    // const user = this.userRepo.findOneBy({
    //  email,
    //  password
    // })
    return 'Hallo ProPra!';
  }

  async register(): Promise<User> {
    const newUser = new User();
    // await this.userRepo.save(newUser);
    return newUser;
  }
}
