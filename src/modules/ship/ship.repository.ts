
import { Service } from 'typedi';
import DataSource from '../../config/database';
import { Query } from '../../enums/query';
import QueryUtils from '../../utils/QueryUtils';
import format from 'pg-format';

@Service()
export default class ShipRepository {
  async findAll() {
    return await this.find(Query.FIND_ALL_SHIPS);
  }

  async findAllGroupByType() {
    return await this.find(Query.FIND_ALL_SHIPS_GROUP_BY_TYPE);
  }

  async findOne(query: Query, id: string) {
    const ships = await DataSource.query(query, [id]);
    console.log(await ships[0])
    return ships[0];
  }

  async findByDynamicQuery(query: Query, sqlQueryMapping: unknown[]) {
    const formattedQuery =
      QueryUtils.formatDynamicQuery(query, sqlQueryMapping);
    console.log(formattedQuery);
    return await DataSource.query(formattedQuery);
  }

  async insertMany(query: Query, values: any[][]) {
    const sql = format(query, values);

    return await DataSource.query(sql);
  }

  private async find(query: Query) {
    return await DataSource.query(query);
  }
}
