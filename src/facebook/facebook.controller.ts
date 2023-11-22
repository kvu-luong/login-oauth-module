import { Controller, Get, Req, Res, Session } from '@nestjs/common';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { FACEBOOK_CALLBACK_URL } from './facebook.constants';
import { FacebookAuthService } from './facebook.service';
import {
  TFBRequestAuthCodePayload,
  TFBResponseAuthCode,
} from './facebook.type';
import { generateCodeChallenge, generateCodeVerifier } from 'src/common/helper';

@Controller()
export class FacebookAuthController {
  constructor(private readonly service: FacebookAuthService) {}
  @Get('facebook-auth')
  async handleGoogleAuthRequest(@Session() session, @Res() res: Response) {
    const state = crypto.randomUUID();
    const nonce = crypto.randomUUID();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    session.fbState = state;
    session.fbCodeVerifier = codeVerifier;

    const authorizationUrl = this.service.requestAuth({
      state,
      nonce,
      codeChallenge,
    } as TFBRequestAuthCodePayload);
    return res.redirect(authorizationUrl);
  }

  @Get(FACEBOOK_CALLBACK_URL)
  async handleFacebookCallBack(@Req() req: Request, @Session() session) {
    const { code, state } = req.query as TFBResponseAuthCode;
    const origin = {
      state: session.fbState,
      codeVerifier: session.fbCodeVerifier,
    };

    // Reset session for another request
    delete session.fbState;
    delete session.fbCodeVerifier;

    return await this.service.handleCallback({
      callback: {
        code,
        state,
      },
      origin,
    });
  }
}
