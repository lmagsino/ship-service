import SpacexApi from '../api/SpacexApi';
import DataSource from '../database/connection';
import format from 'pg-format';

export default class Ship {
  static storeData() {
    SpacexApi.getAll().then(async function (data) {
      // console.log(data);
      const values1: any[] = []
      const values2: any[] = []
      const valuesRoles: any[] = []

      data.forEach(obj => {
        // console.log(obj.id)
        values1.push([obj.id, obj.name, obj.type, obj.year_built, obj.active]);
        values2.push([obj.id, obj.roles])
        valuesRoles.push(obj.roles)
      });

      const b = [...new Set(valuesRoles.flat())];
      const c = b.map(role => {
        return [role]
      })

      // insert role, return array of role obj

      const sqlRole = format('INSERT INTO role (name) VALUES %L returning id, name', c);
      const roleObj = await DataSource.query(sqlRole);

      // insert ship
      const sql = format('INSERT INTO ship (id, name, type, year_built, active) VALUES %L', values1);

      const response = await DataSource.query(sql);

      const shipRoleObj: any[] = []

      values2.forEach(role => {
        role[1].forEach(async function (obj) {
          // search role array
          const roleO = roleObj.find(role => role.name === obj);

          if (roleO === undefined) { return }
          shipRoleObj.push([role[0], roleO.id]);
        })
      })

      const sqlShipRole = format('INSERT INTO ship_role (ship_id, role_id) VALUES %L', shipRoleObj);

      const responsesqlShipRole = await DataSource.query(sqlShipRole);
    });
  }
}
