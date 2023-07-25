import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const API_KEY_QUERY_NAME = 'api-key'

export default class Jwt {
  static verifier(ALLOW_URL: string[]) {
    const middleware = async (ctx, next) => {
      if (ALLOW_URL.includes(ctx.url)) {
        await next();
      } else {
        try {
          const data =
            jwt.verify(
              ctx.request.headers[API_KEY_QUERY_NAME],
              process.env.JWT_SECRET_KEY
            );

          if (data.clientId === process.env.JWT_CLIENT_ID) {
            await next();
          } else {
            ctx.throw(401);
          }
        } catch (error) {
          ctx.throw(401);
        }
      }
    }

    return middleware;
  }
}
