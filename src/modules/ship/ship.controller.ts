import type * as Koa from 'koa';
import HttpStatus from 'http-status-codes';
import { Inject, Service } from 'typedi';
import ShipService from './ship.service';
import type ShipSummary from './ship.summary';
import ObjectUtils from '../../utils/ObjectUtils';

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
}
