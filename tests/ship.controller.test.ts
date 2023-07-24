import 'reflect-metadata';

import { describe, it, expect, beforeEach } from '@jest/globals';
import {createMockContext} from '@shopify/jest-koa-mocks';
import ShipController from '../src/modules/ship/ship.controller';
import mockSummaryObject from "./mocks/mockSummaryObject";
import mockShip from "./mocks/mockShip";
import mockSummary from "./mocks/mockSummary";
import mockShipsByType from "./mocks/mockShipsByType";


jest.mock('../src/modules/ship/ship.service');

import ShipService from "../src/modules/ship/ship.service";

 describe('Ship Controller', () => {

   let shipController: ShipController;
   let shipService: ShipService;
   let ctx;

   beforeEach(async () => {
      shipController = new ShipController();
      shipService = new ShipService();

      shipController.shipService = shipService;
      ctx = createMockContext();
   })

    it('should get summary', async () => {
      const mockFetchSummary = jest.spyOn(shipService, 'getSummary');

      mockFetchSummary.mockImplementation(
         jest.fn().mockResolvedValue(mockSummaryObject)
      );

      await shipController.getSummary(ctx);

      expect(mockFetchSummary).toHaveBeenCalledTimes(1);
      expect(ctx.status).toEqual(200);
      expect(ctx.body).toEqual(mockSummary);
   });

   it('should get by id', async () => {
      const mockFetchById = jest.spyOn(shipService, 'getById');

      mockFetchById.mockImplementation(
         jest.fn().mockResolvedValue(mockShip)
      );

      ctx.params = {ship_id : '5ea6ed2d080df4000697c901'};
      await shipController.getById(ctx);

      expect(mockFetchById).toHaveBeenCalledTimes(1);
      expect(ctx.status).toEqual(200);
      expect(ctx.body).toEqual(mockShip);

   });

   it('should get by type', async () => {
      const mockFetchByType = jest.spyOn(shipService, 'getByDynamicQuery');

      mockFetchByType.mockImplementation(
         jest.fn().mockResolvedValue(mockShipsByType)
      );

      await shipController.getByDynamicQuery(ctx);

      expect(mockFetchByType).toHaveBeenCalledTimes(1);
      expect(ctx.status).toEqual(200);
      expect(ctx.body).toEqual({ships: mockShipsByType});

   });
 })

