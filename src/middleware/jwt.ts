import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import HttpStatus from 'http-status-codes';
import ObjectUtils from '../utils/ObjectUtils';

dotenv.config()

const API_KEY_QUERY_NAME = 'api-key'

export default class Jwt {
  static signer() {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const data = { clientId: process.env.JWT_CLIENT_ID };
    return jwt.sign(data, jwtSecretKey);
  }

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
