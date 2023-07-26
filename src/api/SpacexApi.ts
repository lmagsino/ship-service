import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config()

export default class SpacexApi {
  static async getAll() {
    const response = await fetch(process.env.SPACEX_URL as string);
    return await response.json();
  }
}
