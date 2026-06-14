import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getProfile(@Session() session: UserSession) {
    return this.userService.getProfile(session);
  }
}
