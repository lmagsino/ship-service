import { Inject, Service } from 'typedi';
import ShipRepository from './ship.repository';
import type Ship from './ship.model';
import ShipSummary from './ship.summary';
import ObjectUtils from '../../utils/ObjectUtils';
import { Query } from '../../enums/query';

@Service()
export default class ShipService {
  @Inject()
    shipRepository: ShipRepository;

  @Inject()
    shipSummary: ShipSummary;

  private readonly dynamicQueryMapping = [
    { queryName: 'type', sqlFieldName: 'ship.type' },
    { queryName: 'name', sqlFieldName: 'ship.name' },
    { queryName: 'role', sqlFieldName: 'role.name', special: ['starts_with'] },
    { queryName: 'year_built_start', sqlFieldName: 'ship.year_built', special: ['greater_than_equal'] },
    { queryName: 'year_built_end', sqlFieldName: 'ship.year_built', special: ['less_than_equal'] },
    { queryName: 'page', special: ['page'] },
    { queryName: 'pageSize', special: ['page_size'] }
  ]

  public async getSummary() {
    const ships: Ship[] = await this.shipRepository.find(Query.FIND_ALL_SHIPS);
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
      await this.shipRepository.find(Query.FIND_ALL_SHIPS_GROUP_BY_TYPE);

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
    return sqlQueryMapping;
  }
}
