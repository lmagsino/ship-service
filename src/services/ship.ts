import SpacexApi from '../api/SpacexApi';
import ShipRepository from '../repositories/ship';
import RoleRepository from '../repositories/role';

export default class Ship {
  static storeData() {
    SpacexApi.getAll().then(async function (data) {
      const values1: any[] = []
      const values2: any[] = []
      const roles: any[] = []

      data.forEach(obj => {
        values1.push([obj.id, obj.name, obj.type, obj.year_built, obj.active]);
        values2.push([obj.id, obj.roles])
        roles.push(obj.roles)
      });

      const savedRoles = await RoleRepository.bulkInsert(Ship.formatRoles(roles));
      ShipRepository.bulkInsert(values1);

      const shipRoleObj: any[] = []

      values2.forEach(role => {
        role[1].forEach(async function (obj) {
          // search role array
          const roleO = Ship.findRole(savedRoles, obj);
          if (roleO === undefined) { return }
          shipRoleObj.push([role[0], roleO.id]);
        })
      })

      ShipRepository.bulkInsertShipRole(shipRoleObj);
    });
  }

  static formatRoles(roles) {
    const uniqueRoles = [...new Set(roles.flat())];
    return uniqueRoles.map(role => {
      return [role];
    });
  }

  static findRole(roles, roleName) {
    return roles.find(role => role.name === roleName);
  }
}
