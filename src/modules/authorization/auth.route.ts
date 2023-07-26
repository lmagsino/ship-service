import type * as Koa from 'koa';

import Router from 'koa-router';
import { Service } from 'typedi';
import Jwt from '../../middleware/jwt';

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
      ctx.body = Jwt.signer();
    });

    return this.router;
  }
}
