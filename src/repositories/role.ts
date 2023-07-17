import DataSource from '../config/database';
import format from 'pg-format';

export default class RoleRepository {
  static async bulkInsert(values) {
    const sql = format('INSERT INTO role (name) VALUES %L returning id, name', values);

    return await DataSource.query(sql);
  }
}
