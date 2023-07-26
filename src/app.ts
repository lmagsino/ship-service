import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import HttpStatus from 'http-status-codes';
import DataSource from './config/database';
import ShipRoute from './modules/ship/ship.route'
import AuthRoute from './modules/authorization/auth.route';
import DocsRoute from './modules/documentation/docs.route';
import { Container } from 'typedi';

import Jwt from './middleware/jwt';
import ShipService from './modules/ship/ship.service';

const app = new Koa();

const ALLOWED_URLS = ['/docs', '/auth/generateApiKey', '/favicon.png'];

function middleware() {
  app.use(Jwt.verifier(ALLOWED_URLS));
  app.use(bodyParser());
}

function routes() {
  const shipRoute = Container.get(ShipRoute);
  const authRoute = Container.get(AuthRoute);
  const docsRoute = Container.get(DocsRoute);

  app.use(shipRoute.getRouter().routes());
  app.use(shipRoute.getRouter().allowedMethods());
  app.use(authRoute.getRouter().routes());
  app.use(authRoute.getRouter().allowedMethods());
  app.use(docsRoute.getRouter().routes());
  app.use(docsRoute.getRouter().allowedMethods());
}

function initialize() {
  DataSource.initialize().then(async () => {
    const PORT: number = Number(process.env.PORT);
    app.listen(PORT);

    const shipService = Container.get(ShipService);
    await shipService.saveDataByBatch();
  }).catch((error) => { console.log(error); })
}

function errorLogging() {
// Generic error handling middleware.
  app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
      await next();
    } catch (error) {
      ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
      ctx.body = { error };
      ctx.app.emit('error', error) // logs
    //   ctx.status = error.statusCode ?? error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    //   error.status = ctx.status;
    //   ctx.body = { error };
    }
  });

  // Application error logging.
  app.on('error', console.error);
}

middleware();
routes();
initialize();
errorLogging();

export default app;
