import { Body, Controller, Param, Post } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollBodyDto } from './dto/create-poll.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('polls')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post(':roomId/:timetableId')
  async createPoll(
    @Param('roomId') roomId: string,
    @Param('timetableId') timetableId: string,
    @Body() body: CreatePollBodyDto,
    @Session() session: UserSession,
  ) {
    return await this.pollService.createPoll(
      { roomId, timetableId, ...body },
      session,
    );
  }
}
