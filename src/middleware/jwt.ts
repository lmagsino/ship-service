import jwt from 'jsonwebtoken';

export default class Jwt {
  /**
   * This function will generate a JWT token.
   * @param secretKey
   * @param data
   * @returns {string} signed JWT token.
   */
  static sign(secretKey: string, data: unknown): string {
    return jwt.sign(data, secretKey);
  }

  /**
   * This function will verify and decode a JWT token.
   * @param apiKey
   * @param secretKey
   * @returns {unknown} data of a JWT token.
   */
  static verify(apiKey: string, secretKey: string) {
    return jwt.verify(apiKey, secretKey);
  }
}
