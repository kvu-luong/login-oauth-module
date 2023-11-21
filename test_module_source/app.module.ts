import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GoogleAuthModule, Scope } from 'src';
import configuration from './config/configuration';
import { GoogleAuthMainService } from './google/google.service';
import { GoogleAuthMainModule } from './google/google.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GoogleAuthModule.forRoot({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: [Scope.EMAIL, Scope.PROFILE],
      baseUrl: process.env.BASE_URL,
      service: GoogleAuthMainService,
      module: GoogleAuthMainModule,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
