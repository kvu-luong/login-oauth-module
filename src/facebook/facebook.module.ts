import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  TFBResponseTokenEndPoint,
  TFacebookLoginOptions,
} from './facebook.type';
import { FACEBOOK_AUTH_INSTANCE } from './facebook.constants';
import { createProvider } from './facebook.provider';
import { FacebookAuthService } from './facebook.service';
import { FacebookAuthController } from './facebook.controller';

@Module({})
export class FacebookAuthModule {
  static forRoot(
    options: TFacebookLoginOptions<TFBResponseTokenEndPoint>,
  ): DynamicModule {
    const provider = createProvider(options);
    return {
      imports: [HttpModule, options.module],
      module: FacebookAuthModule,
      providers: [
        provider,
        FacebookAuthService,
        {
          provide: FACEBOOK_AUTH_INSTANCE,
          useExisting: options.service,
        },
      ],
      controllers: [FacebookAuthController],
      exports: [FacebookAuthService],
    };
  }
}
