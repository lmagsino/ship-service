import DataSource from '../config/database';
import format from 'pg-format';

export default class ShipRepository {
  static queryMapping = [
    { queryName: 'type', sqlFieldName: 'ship.type' },
    { queryName: 'name', sqlFieldName: 'ship.name' },
    { queryName: 'role', sqlFieldName: 'role.name', special: ['starts_with'] },
    { queryName: 'year_built_start', sqlFieldName: 'ship.year_built', special: ['greater_than_equal'] },
    { queryName: 'year_built_end', sqlFieldName: 'ship.year_built', special: ['less_than_equal'] },
    { queryName: 'page', special: ['page'] },
    { queryName: 'pageSize', special: ['page_size'] }
  ]

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
    'Select ship.*, array_agg(role.name) as roles FROM ship INNER JOIN ship_role on ship.id = ship_role.ship_id INNER JOIN role on ship_role.role_id = role.id WHERE ship.id = $1 GROUP BY ship.id ORDER BY ship.name';
    const ships = await DataSource.query(sql, [id]);
    return await ships[0];
  }

  static async findByActive(active) {
    const sql = 'SELECT * from ship where active = $1';
    return await DataSource.query(sql, [active]);
  }

  static async findMinYear() {
    const sql = 'SELECT MIN(year_built) FROM ship ';
    return await DataSource.query(sql);
  }

  static async findMaxYear() {
    const sql = 'SELECT MAX(year_built) FROM ship ';
    return await DataSource.query(sql);
  }

  static async searchAll(params) {
    const sql =
    'Select ship.*, array_agg(role.name) as roles FROM ship INNER JOIN ship_role on ship.id = ship_role.ship_id INNER JOIN role on ship_role.role_id = role.id WHERE %L GROUP BY ship.id ORDER BY ship.name %S';
    const a = this.buildParams(sql, params);
    return await DataSource.query(a);
  }

  static async countShipTypes() {
    const sql = 'SELECT type, count(*) FROM ship group by type';
    return await DataSource.query(sql);
  }

  static buildParams(sql, params) {
    let parameters = '';
    let s = '';
    let page = 0;
    let pageSize = 0;
    params.forEach((param) => {
      if (parameters !== '' && param[0] !== undefined) parameters += 'AND';

      if (param[2] !== undefined) {
        if (param[2][0] === 'starts_with') {
          parameters += ` ${param[0]} LIKE '${param[1]}%'`
        } else if (param[2][0] === 'greater_than_equal') {
          parameters += ` ${param[0]} >= ${param[1]}`
        } else if (param[2][0] === 'less_than_equal') {
          parameters += ` ${param[0]} <= ${param[1]}`
        } else if (param[2][0] === 'page_size') {
          pageSize = Number(param[1]);
        } else if (param[2][0] === 'page') {
          page = param[1];
        }
      } else {
        parameters += ` ${param[0]} = '${param[1]}'`
      }
    })

    if (pageSize > 0) {
      s += ` LIMIT ${pageSize}`;

      if (page > 0) {
        const offset = pageSize * (page - 1);
        s += ` OFFSET ${offset} `
      }
    }

    sql = sql.replace('%L', parameters)
    sql = sql.replace('%S', s)

    return sql
  }
}
