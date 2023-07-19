import type * as Koa from 'koa';
import Router from 'koa-router';
import HttpStatus from 'http-status-codes';
import shipService from '../services/ship';

const routerOpts: Router.IRouterOptions = {
  prefix: '/ships'
};

const router: Router = new Router(routerOpts);

router.get('/query', async (ctx: Koa.Context) => {
  const ships = await shipService.searchAll(ctx.query);

  if (!ships) {
    ctx.throw(HttpStatus.NOT_FOUND);
  }

  ctx.body = {
    ships
  };
});

router.get('/summary', async (ctx: Koa.Context) => {
  console.time('myFunction');

  // Call the function
  const summary = await shipService.getSummary();

  console.timeEnd('myFunction');

  if (!summary) {
    ctx.throw(HttpStatus.NOT_FOUND);
  }

  ctx.body = summary;
});

router.get('/:ship_id', async (ctx: Koa.Context) => {
  const ship = await shipService.findOne(ctx.params.ship_id);

  if (!ship) {
    ctx.throw(HttpStatus.NOT_FOUND);
  }

  ctx.body = ship;
});

export default router;
