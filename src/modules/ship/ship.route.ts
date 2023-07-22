import type * as Koa from 'koa';

import Router from 'koa-router';
import { Inject, Service } from 'typedi';
import ShipController from './ship.controller';

@Service()
export default class ShipRoute {
  private readonly router: Router

  @Inject()
    shipController: ShipController;

  constructor() {
    const routerOpts: Router.IRouterOptions = {
      prefix: '/ships'
    };

    this.router = new Router(routerOpts);
  }

  public getRouter(): Router {
    this.router.get('/summary', async (ctx: Koa.Context) => {
      await this.shipController.getSummary(ctx);
    });

    this.router.get('/:ship_id', async (ctx: Koa.Context) => {
      await this.shipController.getById(ctx);
    });

    return this.router;
  }
}
