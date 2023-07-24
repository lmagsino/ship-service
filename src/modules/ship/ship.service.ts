import { Inject, Service } from 'typedi';
import ShipRepository from './ship.repository';
import type Ship from './ship.model';
import ShipSummary from './ship.summary';
import ObjectUtils from '../../utils/ObjectUtils';
import { Query } from '../../enums/query';
import SpacexApi from '../../api/SpacexApi';
import RoleRepository from '../role/role.repository';
import { SpecialQuery } from '../../enums/special_query';

@Service()
export default class ShipService {
  @Inject()
    shipRepository: ShipRepository;

  @Inject()
    shipSummary: ShipSummary;

  @Inject()
    roleRepository: RoleRepository;

  private readonly dynamicQueryMapping = [
    { queryName: 'type', sqlFieldName: 'ship.type' },
    { queryName: 'name', sqlFieldName: 'ship.name' },
    { queryName: 'role', sqlFieldName: 'role.name', special: [SpecialQuery.STARTS_WITH] },
    { queryName: 'year_built_start', sqlFieldName: 'ship.year_built', special: [SpecialQuery.GREATER_THAN_EQUAL] },
    { queryName: 'year_built_end', sqlFieldName: 'ship.year_built', special: [SpecialQuery.LESS_THAN_EQUAL] },
    { queryName: 'page', special: [SpecialQuery.PAGE] },
    { queryName: 'page_size', special: [SpecialQuery.PAGE_SIZE] }
  ]

  public async getSummary() {
    const ships: Ship[] = await this.shipRepository.findAll();
    const totalShips: number = ships.length;
    let totalActiveShips: number = 0;
    let totalInactiveShips: number = 0;
    let minYear: number = 0;
    let maxYear: number = 0;

    ships.forEach((ship: Ship) => {
      if (ship.active) { totalActiveShips++ } else { totalInactiveShips++ }

      if (ObjectUtils.isNotNull(ship.year_built)) {
        minYear = this.getMinYear(minYear, ship.year_built);
        maxYear = this.getMaxYear(maxYear, ship.year_built);
      }
    });

    this.shipSummary.totalShips = totalShips;
    this.shipSummary.totalActiveShips = totalActiveShips;
    this.shipSummary.totalInactiveShips = totalInactiveShips;
    this.shipSummary.shipTypes = await this.getShipTypes();
    this.shipSummary.minYear = minYear;
    this.shipSummary.maxYear = maxYear;

    return this.shipSummary;
  }

  public async getById(id: string) {
    const ship: Ship = await this.shipRepository.findOne(Query.FIND_SHIP, id);
    return ship;
  }

  public async getByDynamicQuery(params) {
    const sqlQueryMapping = this.getSqlQueryMapping(params);
    const ship: Ship =
      await this.shipRepository.findByDynamicQuery(
        Query.FIND_BY_DYNAMIC_QUERY, sqlQueryMapping
      );
    return ship;
  }

  public async saveDataByBatch() {
    if (await this.hasExistingData()) return;

    const ships: any[] = [];
    const shipRoles: any[] = [];
    const roles: any[] = [];

    const shipData = await SpacexApi.getAll();

    shipData.forEach(obj => {
      ships.push([obj.id, obj.name, obj.type, obj.year_built, obj.active]);
      shipRoles.push([obj.id, obj.roles])
      roles.push(obj.roles)
    });

    const insertedRoles = await this.createRoles(roles);
    await this.shipRepository.insertMany(Query.INSERT_SHIPS, ships);

    const shipRoleMapping =
      this.createShipRoleMapping(insertedRoles, shipRoles);

    await this.shipRepository.insertMany(Query.INSERT_SHIP_ROLES, shipRoleMapping);
  }

  private getMinYear(previousMinYear: number, newYear: number) {
    const minYear =
      ((previousMinYear === 0) || (newYear < previousMinYear))
        ? newYear
        : previousMinYear;

    return minYear;
  }

  private getMaxYear(previousMaxYear: number, newYear: number) {
    const maxYear =
      ((previousMaxYear === 0) || (newYear > previousMaxYear))
        ? newYear
        : previousMaxYear;

    return maxYear;
  }

  private async getShipTypes() {
    const shipTypesMapping =
      await this.shipRepository.findAllGroupByType();

    const shipTypes = {};
    shipTypesMapping.forEach(shipType => {
      shipTypes[shipType.type] = Number(shipType.count)
    })

    return shipTypes;
  }

  private getSqlQueryMapping(params: unknown[]) {
    const sqlQueryMapping: unknown[] = []

    this.dynamicQueryMapping.forEach((dynamicQueryMap) => {
      const queryValue: string = params[dynamicQueryMap.queryName];

      if (ObjectUtils.isNotNull(queryValue)) {
        sqlQueryMapping.push(
          {
            sqlFieldName: dynamicQueryMap.sqlFieldName,
            queryValue,
            special: dynamicQueryMap.special
          }
        );
      }
    })
    console.log('test');
    console.log(sqlQueryMapping)
    return sqlQueryMapping;
  }

  private async hasExistingData() {
    const ships: Ship[] = await this.shipRepository.findAll();
    return ships.length !== 0;
  }

  private formatRoles(roles) {
    const uniqueRoles: any[] = [...new Set(roles.flat())];
    return uniqueRoles.map(role => {
      return [role];
    });
  }

  private findRole(roles: any, roleName: string) {
    return roles.find(role => role.name === roleName);
  }

  private async createRoles(roles: any[]) {
    const formattedRoles = this.formatRoles(roles);
    const insertedRoles =
      await this.roleRepository.insertMany(Query.INSERT_ROLES, formattedRoles);

    return insertedRoles;
  }

  private createShipRoleMapping(insertedRoles: any[], shipRoles: any[]) {
    const shipRoleMapping: any[] = [];
    shipRoles.forEach(shipRole => {
      shipRole[1].forEach(role => {
        const roleObj = this.findRole(insertedRoles, role);
        if (ObjectUtils.isNull(roleObj)) { return; }
        shipRoleMapping.push([shipRole[0], roleObj.id]);
      })
    })

    return shipRoleMapping;
  }
}
