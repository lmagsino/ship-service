import SpacexApi from '../api/SpacexApi';
import ShipRepository from '../repositories/ship';
import RoleRepository from '../repositories/role';

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

      const roleObj = await RoleRepository.bulkInsert(c);
      ShipRepository.bulkInsert(values1);

      const shipRoleObj: any[] = []

      values2.forEach(role => {
        role[1].forEach(async function (obj) {
          // search role array
          const roleO = roleObj.find(role => role.name === obj);

          if (roleO === undefined) { return }
          shipRoleObj.push([role[0], roleO.id]);
        })
      })

      ShipRepository.bulkInsertShipRole(shipRoleObj);
    });
  }
}
