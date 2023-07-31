import HttpStatus from 'http-status-codes';
import ObjectUtils from '../utils/ObjectUtils';
import Jwt from './jwt';

const API_KEY_QUERY_NAME = 'api-key';
const ALLOWED_URLS = ['/docs', '/favicon.png'];

export default class Auth {
  /**
   * This function will verify if the accessor is authorized to access the URL.
   * @returns
   */
  static verifier() {
    const middleware = async (ctx, next) => {
      if (ALLOWED_URLS.includes(ctx.url)) {
        await next();
      } else {
        let data: any;

        try {
          const apiKey: string = ctx.request.headers[API_KEY_QUERY_NAME];
          const secretKey: string = process.env.JWT_SECRET_KEY ?? '';
          data = Jwt.verify(apiKey, secretKey);
        } catch (e) {
          ctx.throw(HttpStatus.UNAUTHORIZED);
        }

        if (ObjectUtils.isNotNull(data)) {
          if (data.clientId === process.env.JWT_CLIENT_ID) {
            await next();
          } else {
            ctx.throw(HttpStatus.UNAUTHORIZED);
          }
        }
      }
    }

    return middleware;
  }
}
