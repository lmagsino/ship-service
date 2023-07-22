import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import HttpStatus from 'http-status-codes';
import Ship from './services/ship';
import DataSource from './config/database';
import ShipRoute from './modules/ship/ship.route'
import { Container } from 'typedi';

import jwtVerifier from './lib/jwtVerifier';

const app = new Koa();

app.use(jwtVerifier());

// Generic error handling middleware.
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    console.log('test')
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx)
    //   ctx.status = error.statusCode ?? error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    //   error.status = ctx.status;
    //   ctx.body = { error };
  }
});
app.use(bodyParser());

function routes() {
  const shipRoute = Container.get(ShipRoute);

  app.use(shipRoute.getRouter().routes());
  app.use(shipRoute.getRouter().allowedMethods());
}

routes();

// Application error logging.
app.on('error', console.error);

const PORT: number = Number(process.env.PORT) || 3000;

DataSource.initialize()
  .then(() => {
    app.listen(PORT);
    Ship.storeData();
  })
  .catch((error) => { console.log(error); })

export default app;
