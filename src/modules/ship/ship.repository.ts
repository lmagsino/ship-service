
import { Service } from 'typedi';
import DataSource from '../../config/database';
import { type Query } from '../../enums/query';
import QueryUtils from '../../utils/QueryUtils';
import format from 'pg-format';

@Service()
export default class ShipRepository {
  async find(query: Query) {
    return await DataSource.query(query);
  }

  async findOne(query: Query, id: string) {
    const ships = await DataSource.query(query, [id]);
    return ships[0];
  }

  async findByDynamicQuery(query: Query, sqlQueryMapping: unknown[]) {
    const formattedQuery =
      QueryUtils.formatDynamicQuery(query, sqlQueryMapping);
    return await DataSource.query(formattedQuery);
  }

  async insertMany(query: Query, values: any[][]) {
    const sql = format(query, values);

    return await DataSource.query(sql);
  }
}
