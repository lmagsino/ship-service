import jwt from 'jsonwebtoken';

import HttpStatus from 'http-status-codes';
import ObjectUtils from '../utils/ObjectUtils';

const API_KEY_QUERY_NAME = 'api-key';

export default class Jwt {
  /**
   * This function will generate a JWT token.
   * @param secretKey
   * @param data
   * @returns {string} signed JWT token.
   */
  static signer(secretKey: string, data: unknown): string {
    return jwt.sign(data, secretKey);
  }

  /**
   *
   * @param ALLOWED_URLS
   * @returns
   */
  static verifier(ALLOWED_URLS: string[]) {
    const middleware = async (ctx, next) => {
      if (ALLOWED_URLS.includes(ctx.url)) {
        await next();
      } else {
        let data;

        try {
          data = jwt.verify(
            ctx.request.headers[API_KEY_QUERY_NAME],
            process.env.JWT_SECRET_KEY
          );
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
