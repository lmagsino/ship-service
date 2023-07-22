import { Service } from 'typedi'

@Service()
export default class ShipSummary {
  private _totalShips: number;
  private _totalActiveShips: number;
  private _totalInactiveShips: number;
  private _shipTypes: unknown;
  private _minYear: number;
  private _maxYear: number;

  public get totalShips() {
    return this._totalShips;
  }

  public set totalShips(value: number) {
    this._totalShips = value;
  }

  public get totalActiveShips() {
    return this._totalActiveShips;
  }

  public set totalActiveShips(value: number) {
    this._totalActiveShips = value;
  }

  public get totalInactiveShips() {
    return this._totalInactiveShips;
  }

  public set totalInactiveShips(value: number) {
    this._totalInactiveShips = value;
  }

  public get shipTypes() {
    return this._shipTypes;
  }

  public set shipTypes(value: unknown) {
    this._shipTypes = value;
  }

  public get minYear() {
    return this._minYear;
  }

  public set minYear(value: number) {
    this._minYear = value;
  }

  public get maxYear() {
    return this._maxYear;
  }

  public set maxYear(value: number) {
    this._maxYear = value;
  }

  public decorated(): any {
    return {
      total_ships: this.totalShips,
      total_active_ships: this.totalActiveShips,
      total_inactive_ships: this.totalInactiveShips,
      ship_types: this.shipTypes,
      min_year: this.minYear,
      max_year: this.maxYear
    }
  }
}
