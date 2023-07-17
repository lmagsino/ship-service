import Koa from 'koa';
import HttpStatus from 'http-status-codes';
import Ship from './services/ship';
import DataSource from './database/connection';

const app = new Koa();

// Generic error handling middleware.
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.statusCode ?? error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
});

// Initial route
app.use(async (ctx: Koa.Context) => {
  console.log('test')
  // ctx.body = 'Hello world';
});

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
