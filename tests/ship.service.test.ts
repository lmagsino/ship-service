import 'reflect-metadata';

import { describe, it, expect, beforeEach } from '@jest/globals';
import ShipService from '../src/modules/ship/ship.service';
import ShipSummary from "../src/modules/ship/ship.summary";
import mockShips from "./mocks/mockShips";
import mockSummaryObject from "./mocks/mockSummaryObject";
import mockShipTypes from "./mocks/mockShipTypes";

jest.mock('../src/modules/ship/ship.repository');

import ShipRepository from '../src/modules/ship/ship.repository';

 describe('Ship Service', () => {

   let shipService: ShipService;
   let shipRepository: ShipRepository;
   let shipSummary: ShipSummary;

   beforeEach(async () => {
        shipService = new ShipService();
        shipRepository = new ShipRepository();
        shipSummary = new ShipSummary();
        shipService.shipRepository = shipRepository;
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
 })

