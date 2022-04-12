import { Controller, Get } from '@nestjs/common';
import { User } from './user';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('login')
  login(): Promise<string> {
    return this.userService.login('', '');
  }

  @Get('register')
  register(): Promise<User> {
    return this.userService.register();
  }
}
