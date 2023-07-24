import 'reflect-metadata';

import { describe, it, expect, beforeEach } from '@jest/globals';
import ShipService from '../src/modules/ship/ship.service';
import ShipSummary from "../src/modules/ship/ship.summary";
import mockShips from "./mocks/mockShips";
import mockSummaryObject from "./mocks/mockSummaryObject";
import mockShipTypes from "./mocks/mockShipTypes";
import mockShip from "./mocks/mockShip";
import mockShipsByType from "./mocks/mockShipsByType";
import mockInsertedRoles from "./mocks/mockInsertedRoles";


jest.mock('../src/modules/ship/ship.repository');
jest.mock('../src/modules/role/role.repository');

import ShipRepository from '../src/modules/ship/ship.repository';
import RoleRepository from "../src/modules/role/role.repository";

  describe('Ship Service', () => {

    let shipService: ShipService;
    let shipRepository: ShipRepository;
    let roleRepository: RoleRepository;
    let shipSummary: ShipSummary;

    beforeEach(async () => {
          shipService = new ShipService();
          shipRepository = new ShipRepository();
          roleRepository = new RoleRepository();
          shipSummary = new ShipSummary();
          shipService.shipRepository = shipRepository;
          shipService.roleRepository = roleRepository;
          shipService.shipSummary = shipSummary;
    })

    it('should get summary', async () => {
      const mockFindAll = jest.spyOn(shipRepository, 'findAll');
      const mockFindAllGroupByType =
        jest.spyOn(shipRepository, 'findAllGroupByType');

      mockFindAll.mockImplementation(
          jest.fn().mockResolvedValue(mockShips)
      );

      mockFindAllGroupByType.mockImplementation(
        jest.fn().mockResolvedValue(mockShipTypes)
      );

      const summary = await shipService.getSummary();
      expect(summary).toEqual(mockSummaryObject);

    });

    it('should get by id', async () => {
      const mockFindOne = jest.spyOn(shipRepository, 'findOne');

      mockFindOne.mockImplementation(
          jest.fn().mockResolvedValue(mockShip)
      );

      const ship = await shipService.getById('5ea6ed2d080df4000697c901');
      expect(ship).toEqual(mockShip);

    });

    it('should get by type', async () => {
      const mockFindAllByDynamicQuery =
        jest.spyOn(shipRepository, 'findByDynamicQuery');

      mockFindAllByDynamicQuery.mockImplementation(
          jest.fn().mockResolvedValue(mockShipsByType)
      );

      const params = {type: 'Cargo'};
      const ships = await shipService.getByDynamicQuery(params);
      expect(ships).toEqual(mockShipsByType);
    });

    it('should save all data', async () => {
      const mockFindAll =
        jest.spyOn(shipRepository, 'findAll');

      mockFindAll.mockImplementation(
        jest.fn().mockResolvedValue(mockShips)
      );

      const mockInsertRoles =
        jest.spyOn(roleRepository, 'insertMany');

      mockInsertRoles.mockImplementation(
        jest.fn().mockResolvedValue(mockInsertedRoles)
      );

      jest.spyOn(shipRepository, 'insertManyShip');

      jest.spyOn(shipRepository, 'insertManyShipRoles');

      const shipRoles = await shipService.saveDataByBatch();
      expect(shipRoles).toBeUndefined();
    });
 })

