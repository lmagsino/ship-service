import DataSource from '../config/database';
import format from 'pg-format';

export default class ShipRepository {
  static async bulkInsert(values) {
    const sql = format('INSERT INTO ship (id, name, type, year_built, active) VALUES %L', values);

    return await DataSource.query(sql);
  }

  static async bulkInsertShipRole(values) {
    const sql = format('INSERT INTO ship_role (ship_id, role_id) VALUES %L', values);

    return await DataSource.query(sql);
  }

  static async findAll() {
    const sql = 'SELECT * from ship';
    return await DataSource.query(sql);
  }
}
