import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from 'src/user/dto/user.dto';
import { UserSignInDTO } from 'src/user/dto/user.signin.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Body() req: UserSignInDTO) {
    console.log(req.username);
    return await this.authService.signIn(req.username);
  }

  @Post('signup')
  async signUp(@Body() userDTO: UserDTO) {
    return await this.authService.signUp(userDTO);
  }
}
