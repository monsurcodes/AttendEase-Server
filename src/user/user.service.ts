import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { type UserSession } from '@thallesp/nestjs-better-auth';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  getProfile(session: UserSession) {
    return session.user;
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }
}
