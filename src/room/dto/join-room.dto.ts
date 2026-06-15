import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const joinRoomSchema = z.object({
  inviteCode: z.string().nonempty('inviteCode must not be empty.'),
});

export class JoinRoomDto extends createZodDto(joinRoomSchema) {}
