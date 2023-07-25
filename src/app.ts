import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import HttpStatus from 'http-status-codes';
import DataSource from './config/database';
import ShipRoute from './modules/ship/ship.route'
import { Container } from 'typedi';

import Jwt from './middleware/jwt';
import ShipService from './modules/ship/ship.service';
import yamljs from 'yamljs';
import { koaSwagger } from 'koa2-swagger-ui';
import Router from 'koa-router';

const app = new Koa();

const router = new Router();
const ALLOW_URL = ['/docs', '/favicon.png'];

function middleware() {
  // .load loads file from root.
  const spec = yamljs.load('./openapi.yaml');
  router.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }));

  app.use(Jwt.verifier(ALLOW_URL));
  app.use(router.routes());
  app.use(bodyParser());
}

function routes() {
  const shipRoute = Container.get(ShipRoute);

  app.use(shipRoute.getRouter().routes());
  app.use(shipRoute.getRouter().allowedMethods());
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
