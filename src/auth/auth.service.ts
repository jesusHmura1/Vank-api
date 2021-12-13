import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.userService.findByUserName(name);

    const isValidPassword = this.userService.checkPassword(
      password,
      user.password,
    );

    if (user && isValidPassword) {
      return user;
    }
    return null;
  }

  async signIn(user: any) {
    const payload = {
      user: user.userName,
      sub: user._id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signUp(userDTO: UserDTO) {
    return this.userService.created(userDTO);
  }
}
