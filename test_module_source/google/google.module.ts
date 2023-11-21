import { Module } from '@nestjs/common';
import { GoogleAuthMainService } from './google.service';

@Module({
  providers: [GoogleAuthMainService],
  exports: [GoogleAuthMainService],
})
export class GoogleAuthMainModule {}
