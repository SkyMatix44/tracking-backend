import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
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
  signup(@Body() dto: SignUpDto): Promise<{ access_token: string }> {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signin(dto);
  }

  @Post('confirm/new-email/:email/:token')
  confirmNewEmail(@Param('email') email: string, @Param('token') token: string): Promise<void> {
    console.log('Test');
    return this.authService.confirmNewEmail(email, token);
  }
}
