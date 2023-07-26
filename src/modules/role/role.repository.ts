
import { Service } from 'typedi';
import DataSource from '../../config/database';
import { type Query } from '../../enums/query';
import format from 'pg-format';

@Service()
export default class RoleRepository {
  async insertMany(query: Query, values: any[][]) {
    const sql = format(query, values);

    return await DataSource.query(sql);
  }

  async findAllByShipId(query: Query, id: string) {
    return await DataSource.query(query, [id]);
  }
}
