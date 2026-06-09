import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // exisiting user check
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const { password, ...registerDtoWithoutPassword } = registerDto;

    // password hash
    const saltOrRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltOrRounds);

    // creating a new user
    const user = await this.userService.createUser({
      ...registerDtoWithoutPassword,
      passwordHash,
    });

    return {
      message: 'User registered!',
      user,
    };
  }

  emailSignIn() {
    return {
      message: 'User signed in with email!',
    };
  }

  usernameSignIn() {
    return {
      message: 'User signed in with username!',
    };
  }

  signOut() {
    return {
      message: 'User signed out!',
    };
  }
}
