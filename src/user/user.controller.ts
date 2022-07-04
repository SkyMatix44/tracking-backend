import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Roles } from '../auth/decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Get('me')
  // getMe(@GetUser() user: User) {
  //   return user;
  // }

  @Post('update/password')
  changePassword(@Request() req: TrackingRequest, @Body() dto: ChangePasswordDto): Promise<void> {
    return this.userService.changePassword(req, dto);
  }

  @Post('update/email')
  changeEmail(@Request() req: TrackingRequest, @Body() dto: ChangeEmailDto): Promise<void> {
    return this.userService.changeEmail(req, dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post(':id/block')
  blockUser(@Request() req: TrackingRequest, @Param('id', ParseIntPipe) userId: number): Promise<void> {
    return this.userService.blockUser(req, userId, true);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post(':id/unblock')
  unblockUser(@Request() req: TrackingRequest, @Param('id', ParseIntPipe) userId: number): Promise<void> {
    return this.userService.blockUser(req, userId, false);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('all')
  getAll(@Request() req: TrackingRequest): Promise<User[]> {
    return this.userService.getAllUser(req);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post(':id/update')
  updateAdmin(
    @Request() req: TrackingRequest,
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserAdminDto,
  ): Promise<User> {
    return this.userService.update(req, userId, dto);
  }

  @Patch('update')
  update(@Request() req: TrackingRequest, @Body() dto: UpdateUserDto): Promise<User> {
    return this.userService.update(req, req.userId, dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('create')
  create(@Request() req: TrackingRequest, @Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(req, dto);
  }
}
