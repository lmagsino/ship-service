import Router from 'koa-router';
import { Service } from 'typedi';
import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';

@Service()
export default class AuthRoute {
  private readonly router: Router

  constructor() {
    this.router = new Router();
  }

  public getRouter(): Router {
    const spec = yamljs.load('./openapi.yaml');
    const swagger =
        koaSwagger({ routePrefix: false, swaggerOptions: { spec } });
    this.router.get('/docs', swagger);

    return this.router;
  }
}
