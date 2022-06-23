import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { SessionController } from './session/session.controller';
import { SessionModule } from './session/session.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, SessionModule, UserModule],
  controllers: [AppController, SessionController],
  providers: [AppService, PrismaService, UserService],
})
export class AppModule {}
