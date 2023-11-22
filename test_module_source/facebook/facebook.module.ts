import { Module } from '@nestjs/common';
import { FacebookAuthMainService } from './facebook.service';

@Module({
  providers: [FacebookAuthMainService],
  exports: [FacebookAuthMainService],
})
export class FacebookAuthMainModule {}
