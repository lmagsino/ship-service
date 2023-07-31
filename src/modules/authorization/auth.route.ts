import type * as Koa from 'koa';
import Jwt from '../../middleware/jwt';
import Router from 'koa-router';
import dotenv from 'dotenv';
import { Service } from 'typedi';

dotenv.config();

@Service()
export default class AuthRoute {
  private readonly router: Router

  constructor() {
    const routerOpts: Router.IRouterOptions = {
      prefix: '/auth'
    };

    this.router = new Router(routerOpts);
  }

  public getRouter(): Router {
    this.router.get('/generateApiKey', async (ctx: Koa.Context) => {
      const jwtSecretKey: string = process.env.JWT_SECRET_KEY ?? '';
      const data: unknown = { clientId: process.env.JWT_CLIENT_ID };

      ctx.body = Jwt.signer(jwtSecretKey, data);
    });

    return this.router;
  }
}
