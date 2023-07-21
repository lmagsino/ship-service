import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const jwtVerifier = function () {
  const middleware = async (ctx, next) => {
    try {
      const data = jwt.verify(ctx.request.headers['api-key'], process.env.JWT_SECRET_KEY);

      if (data.clientId === process.env.JWT_CLIENT_ID) {
        await next();
      } else {
        ctx.throw(401);
      }
    } catch (error) {
      ctx.throw(401);
    }
  }

  return middleware;
}

export default jwtVerifier;
