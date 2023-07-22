import { Inject, Service } from 'typedi';
import ShipRepository from './ship.repository';
import type Ship from '../../models/ship';
import ShipSummary from './ship.summary';
import ObjectUtils from '../../utils/ObjectUtils';
import { Query } from '../../enums/query';

@Service()
export default class ShipService {
  @Inject()
    shipRepository: ShipRepository;

  @Inject()
    shipSummary: ShipSummary;

  public async getSummary() {
    const ships: Ship[] = await this.shipRepository.find(Query.FIND_ALL);
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
      await this.shipRepository.find(Query.FIND_ALL_GROUP_BY_TYPE);

    const shipTypes = {};
    shipTypesMapping.forEach(shipType => {
      shipTypes[shipType.type] = Number(shipType.count)
    })

    return shipTypes;
  }
}
