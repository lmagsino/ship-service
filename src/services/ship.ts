import SpacexApi from '../api/SpacexApi';
import ShipRepository from '../repositories/ship';
import RoleRepository from '../repositories/role';

export default class ShipService {
  static async storeData() {
    if (await this.hasExistingData()) return;

    SpacexApi.getAll().then(async function (data) {
      const values1: any[] = []
      const values2: any[] = []
      const roles: any[] = []

      data.forEach(obj => {
        values1.push([obj.id, obj.name, obj.type, obj.year_built, obj.active]);
        values2.push([obj.id, obj.roles])
        roles.push(obj.roles)
      });

      const savedRoles = await RoleRepository.bulkInsert(ShipService.formatRoles(roles));
      ShipRepository.bulkInsert(values1);

      const shipRoleObj: any[] = []

      values2.forEach(role => {
        role[1].forEach(async function (obj) {
          // search role array
          const roleO = ShipService.findRole(savedRoles, obj);
          if (roleO === undefined) { return }
          shipRoleObj.push([role[0], roleO.id]);
        })
      })

      ShipRepository.bulkInsertShipRole(shipRoleObj);
    });
  }

  static async findOne(id) {
    return await ShipRepository.findOne(id);
  }

  static async searchAll(params) {
    return await ShipRepository.searchAll(ShipService.buildQueryMapping(params));
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

  static async hasExistingData() {
    const ships = await ShipRepository.findAll();

    if (ships.length !== 0) return true;
  }

  static buildQueryMapping(params) {
    const mapping: any[] = []

    ShipRepository.queryMapping.forEach((queryMap) => {
      const value = params[queryMap.queryName]
      if (value) {
        mapping.push([queryMap.sqlFieldName, value, queryMap.special])
      }
    })

    return mapping;
  }
}
