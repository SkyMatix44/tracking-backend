import { User } from './../../node_modules/.prisma/client/index.d';
import { GetUser } from './../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from './../auth/guard/index';
import { Controller, Get, UseGuards } from '@nestjs/common';
@Controller('user')
export class UserController {
    
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@GetUser() user: User) {
     return user;
    }
}
