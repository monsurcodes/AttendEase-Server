import { Module, OnModuleInit } from '@nestjs/common';
import { AuthModule as NestjsBetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth, authExtensions } from './auth.config';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    EmailModule,
    NestjsBetterAuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
    }),
  ],
  exports: [NestjsBetterAuthModule],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly emailService: EmailService) {}

  onModuleInit() {
    authExtensions.sendEmail = async (to, url, name) => {
      await this.emailService.sendVerificationEmail(to, url, name);
    };
  }
}
