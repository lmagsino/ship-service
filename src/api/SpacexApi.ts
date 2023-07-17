
import fetch from 'node-fetch';

export default class SpacexApi {
  static async getAll() {
    const response = await fetch('https://api.spacexdata.com/v4/ships');
    return await response.json();
  }
}
