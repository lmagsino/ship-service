import type * as Koa from 'koa';
import HttpStatus from 'http-status-codes';
import { Inject, Service } from 'typedi';
import ShipService from './ship.service';
import type ShipSummary from './ship.summary';
import ObjectUtils from '../../utils/ObjectUtils';
import type Ship from './ship.model';

@Service()
export default class ShipController {
  @Inject()
    shipService: ShipService;

  public async getSummary(ctx: Koa.Context) {
    const summary: ShipSummary = await this.shipService.getSummary();

    if (ObjectUtils.isNull(summary)) {
      ctx.throw(HttpStatus.BAD_REQUEST);
    }

    ctx.body = summary.decorated();
  }

  public async getByDynamicQuery(ctx: Koa.Context) {
    const ships = await this.shipService.getByDynamicQuery(ctx.query);

    if (ObjectUtils.isNull(ships)) {
      ctx.throw(HttpStatus.NOT_FOUND);
    }

    ctx.body = { ships };
  }

  public async getById(ctx: Koa.Context) {
    const ship: Ship = await this.shipService.getById(ctx.params.ship_id);

    if (ObjectUtils.isNull(ship)) {
      ctx.throw(HttpStatus.NOT_FOUND);
    }

    ctx.body = ship;
  }
}
