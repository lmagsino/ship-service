
import { Service } from 'typedi';
import DataSource from '../../config/database';
import { type Query } from '../../enums/query';

@Service()
export default class ShipRepository {
  async find(query: Query) {
    return await DataSource.query(query);
  }
}
