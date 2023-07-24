import ShipSummary from "../../src/modules/ship/ship.summary";

const shipSummary: ShipSummary = new ShipSummary();
shipSummary.totalShips = 29
shipSummary.totalActiveShips = 15
shipSummary.totalInactiveShips = 14
shipSummary.shipTypes = {
    "Barge":4,
    "Cargo":11,
    "High Speed Craft":2,
    "Tug":12
}
shipSummary.minYear = 1944
shipSummary.maxYear = 2021

export default shipSummary;
