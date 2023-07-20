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

  static async getSummarySql() {
    const ships = await ShipRepository.findAll();
    const activeShips = await ShipRepository.findByActive(true);
    const inactiveShips = await ShipRepository.findByActive(false);
    const minYear = await ShipRepository.findMinYear();
    const maxYear = await ShipRepository.findMaxYear();

    const shipTypesMapping = await ShipRepository.countShipTypes();
    const shipTypes = {};
    shipTypesMapping.forEach(shipType => {
      shipTypes[shipType.type] = shipType.count
    })

    const summary = {
      total_ships: ships.length,
      total_active_ships: activeShips.length,
      total_inactive_ships: inactiveShips.legth,
      ship_types: shipTypes,
      min_year_built: minYear[0].min,
      max_year_built: maxYear[0].max
    }

    return summary;
  }

  static async getSummary() {
    const ships = await ShipRepository.findAll();
    let countShips = 0;
    let countActive = 0;
    let countInactive = 0;
    let minYear = 0;
    let maxYear = 0;

    ships.forEach((ship) => {
      countShips++
      if (ship.active) {
        countActive++
      } else {
        countInactive++
      }

      if (ship.year_built !== null) {
        if (minYear === 0 || ship.year_built < minYear) {
          minYear = ship.year_built
        }

        if (maxYear === 0 || ship.year_built > maxYear) {
          maxYear = ship.year_built
        }
      }
    });

    const shipTypesMapping = await ShipRepository.countShipTypes();
    const shipTypes = {};
    shipTypesMapping.forEach(shipType => {
      shipTypes[shipType.type] = shipType.count
    })

    const summary = {
      total_ships: countShips,
      total_active_ships: countActive,
      total_inactive_ships: countInactive,
      ship_types: shipTypes,
      min_year_built: minYear,
      max_year_built: maxYear
    }

    return summary;
  }

  static formatRoles(roles) {
    const uniqueRoles = [...new Set(roles.flat())];
    return uniqueRoles.map(role => {
      return [role];
    });
  }

  static generateApiKey(secretVal) {
    return btoa(secretVal);
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
