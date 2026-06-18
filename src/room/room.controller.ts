import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @Session() session: UserSession,
  ) {
    return await this.roomService.createRoom(createRoomDto, session);
  }

  @Post('join/:inviteCode')
  async joinRoom(
    @Param('inviteCode') inviteCode: string,
    @Session() session: UserSession,
  ) {
    return await this.roomService.joinRoom({ inviteCode }, session);
  }

  @Get(':id')
  async getRoom(@Param('id') id: string, @Session() session: UserSession) {
    return await this.roomService.getRoom(id, session);
  }

  @Patch(':roomId/members/:memberId/approve')
  async approveMember(
    @Param('roomId') roomId: string,
    @Param('memberId') memberId: string,
    @Session() session: UserSession,
  ) {
    return await this.roomService.approveMember({ roomId, memberId }, session);
  }
}
