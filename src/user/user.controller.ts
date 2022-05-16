import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
import { User } from './../../node_modules/.prisma/client/index.d';
import { GetUser } from './../auth/decorator/get-user.decorator';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Post('update/password')
  changePassword(@Request() req: TrackingRequest, @Body() dto: ChangePasswordDto): Promise<void> {
    return this.userService.changePassword(req, dto);
  }

  @Post('update/email')
  changeEmail(@Request() req: TrackingRequest, @Body() dto: ChangeEmailDto): Promise<void> {
    return this.userService.changeEmail(req, dto);
  }
}
