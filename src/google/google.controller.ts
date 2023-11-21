import { Controller, Get, Req, Res, Session } from '@nestjs/common';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { GOOGLE_CALLBACK_URL } from './google.constants';
import { GoogleAuthService } from './google.service';
import { TAuthCallBackPayload } from './google.type';

@Controller()
export class GoogleAuthController {
  constructor(private readonly service: GoogleAuthService) {}
  @Get('google-auth')
  async handleGoogleAuthRequest(@Session() session, @Res() res: Response) {
    const state = crypto.randomUUID();
    session.state = state;

    const authorizationUrl = await this.service.requestAuth({
      state,
    });
    return res.redirect(authorizationUrl);
  }

  @Get(GOOGLE_CALLBACK_URL)
  async handleGoogleCallBack(@Req() req: Request, @Session() session) {
    const { code, state } = req.query as TAuthCallBackPayload;
    const origin = {
      state: session.state,
    };

    // Reset session for another request
    delete session.state;

    return await this.service.handleCallback({
      callback: {
        code,
        state,
      },
      origin,
    });
  }
}
