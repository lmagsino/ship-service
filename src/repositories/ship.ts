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

  static async findOne(id) {
    const sql =
    'Select ship.*, array_agg(role.name) as roles FROM ship INNER JOIN ship_role on ship.id = ship_role.ship_id INNER JOIN role on ship_role.role_id = role.id WHERE ship.id = $1 GROUP BY ship.id';
    const ships = await DataSource.query(sql, [id]);
    return await ships[0];
  }
}
