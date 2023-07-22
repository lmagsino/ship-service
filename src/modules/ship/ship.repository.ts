
import { Service } from 'typedi';
import DataSource from '../../config/database';
import { type Query } from '../../enums/query';

@Service()
export default class ShipRepository {
  async find(query: Query) {
    return await DataSource.query(query);
  }

  async findOne(query: Query, id: string) {
    const ships = await DataSource.query(query, [id]);
    return ships[0];
  }
}
