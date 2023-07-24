import 'reflect-metadata';

import { describe, it, expect, beforeEach } from '@jest/globals';
import {createMockContext} from '@shopify/jest-koa-mocks';
import ShipController from '../src/modules/ship/ship.controller';
import mockSummaryObject from "./mocks/mockSummaryObject";

jest.mock('../src/modules/ship/ship.service');

import ShipService from '../src/modules/ship/ship.service';

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

      const summary = {
         "total_ships":29,
         "total_active_ships":15,
         "total_inactive_ships":14,
         "ship_types":{
            "Barge":4,
            "Cargo":11,
            "High Speed Craft":2,
            "Tug":12
         },
         "min_year_built":1944,
         "max_year_built":2021,
      }

      expect(ctx.body).toEqual(summary);

   });
 })

