import { DynamicModule, Module } from '@nestjs/common';
import { GoogleAuthService } from './google.service';
import { TGoogleAuthTokenResponse, TGoogleLoginOptions } from './google.type';
import { createProvider } from './gogole.provider';
import { HttpModule } from '@nestjs/axios';
import { GoogleAuthController } from './google.controller';
import { GOOGLE_AUTH_INSTANCE } from './google.constants';

@Module({})
export class GoogleAuthModule {
  static forRoot(
    options: TGoogleLoginOptions<TGoogleAuthTokenResponse>,
  ): DynamicModule {
    const provider = createProvider(options);
    return {
      imports: [HttpModule, options.module],
      module: GoogleAuthModule,
      providers: [
        provider,
        GoogleAuthService,
        {
          provide: GOOGLE_AUTH_INSTANCE,
          useExisting: options.service,
        },
      ],
      controllers: [GoogleAuthController],
      exports: [GoogleAuthService],
    };
  }
}
