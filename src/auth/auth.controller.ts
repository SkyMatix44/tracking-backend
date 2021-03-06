import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInResult } from './dto/sign-in-result.dto';
import { SignUpDto } from './dto/signUp.dto';

/**
 * Only add PUBLIC Endpoints at this controller
 * This Controller do not verify the user (JWT-Token)!
 *
 * For other user action use the UserController
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto): Promise<void> {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto): Promise<SignInResult> {
    return this.authService.signin(dto);
  }

  @Post('confirm/email/:email/:token')
  confirm(@Param('email') email: string, @Param('token') token: string): Promise<SignInResult> {
    return this.authService.confirm(email, token);
  }

  @Post('confirm/new-email/:email/:token')
  confirmNewEmail(@Param('email') email: string, @Param('token') token: string): Promise<SignInResult> {
    return this.authService.confirmNewEmail(email, token);
  }

  @Post('password/reset')
  resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(dto.email);
  }

  @Post('password/change')
  changePassword(@Body() dto: ChangePasswordDto): Promise<void> {
    return this.authService.changePassword(dto);
  }
}
