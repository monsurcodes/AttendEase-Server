import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { PrismaClient } from '../common/generated/prisma/client';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { UserSession } from '@thallesp/nestjs-better-auth';

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(DATABASE_CONNECTION) private prismaService: PrismaClient,
  ) {}

  async markAttendance(createAttendanceDto: CreateAttendanceDto) {
    const attendance = await this.prismaService.attendance.create({
      data: createAttendanceDto,
    });

    return {
      message: 'Attendance marked successfully.',
      attendance,
    };
  }

  async updateAttendance(updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.prismaService.attendance.update({
      where: {
        userId_timetableId_date: {
          userId: updateAttendanceDto.userId,
          timetableId: updateAttendanceDto.timetableId,
          date: updateAttendanceDto.date,
        },
      },
      data: {
        status: updateAttendanceDto.status,
        isManual: true,
      },
    });

    return {
      message: 'Attendance updated successfully.',
      attendance,
    };
  }

  async getAllAttendance(session: UserSession) {
    const attendances = await this.prismaService.attendance.findMany({
      where: { userId: session.user.id },
    });

    return {
      message: 'Attendances fetched successfully.',
      attendances,
    };
  }

  async getAttendance(session: UserSession, timetableId: string) {
    const attendances = await this.prismaService.attendance.findMany({
      where: { userId: session.user.id, timetableId },
    });

    return {
      message: 'Attendances fetched successfully.',
      attendances,
    };
  }
}
