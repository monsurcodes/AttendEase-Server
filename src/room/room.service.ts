import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { type UserSession } from '@thallesp/nestjs-better-auth';
import { JoinRoomDto } from './dto/join-room.dto';

@Injectable()
export class RoomService {
  constructor(private prismaService: PrismaService) {}

  async createRoom(createRoomDto: CreateRoomDto, session: UserSession) {
    const inviteCode = this.#generateInviteCode();

    const room = await this.prismaService.room.create({
      data: {
        inviteCode,
        name: createRoomDto.name,
        adminId: session.user.id,
      },
    });

    if (!room) {
      throw new BadRequestException('Failed to create room.');
    }

    const roomMember = await this.prismaService.roomMember.create({
      data: {
        roomId: room.id,
        userId: session.user.id,
        role: 'ADMIN',
        isApproved: true,
      },
    });

    if (!roomMember) {
      throw new BadRequestException('Failed to assign user as room admin.');
    }

    return {
      message: 'Room created successfully.',
      room,
      roomMember,
    };
  }

  async joinRoom(joinRoomDto: JoinRoomDto, session: UserSession) {
    const room = await this.prismaService.room.findUnique({
      where: { inviteCode: joinRoomDto.inviteCode },
    });

    if (!room) {
      throw new BadRequestException('Invalid invite code.');
    }

    const existingRoomMember = await this.prismaService.roomMember.findUnique({
      where: { roomId_userId: { roomId: room.id, userId: session.user.id } },
    });

    if (existingRoomMember) {
      throw new BadRequestException('Member already joined the room.');
    }

    const roomMember = await this.prismaService.roomMember.create({
      data: { roomId: room.id, userId: session.user.id },
    });

    if (!roomMember) {
      throw new BadRequestException('Failed to join room.');
    }

    return {
      message: 'Room joined successfully.',
      room,
      roomMember,
    };
  }

  #generateInviteCode() {
    const code = Date.now().toString(36).slice(-6).toUpperCase();

    if (!code) {
      throw new BadRequestException(
        'Failed to create 6-characters invite code.',
      );
    }

    return code;
  }
}
