'use strict';
const Controller = require('../core/baseController');
const { getUTCYesterdayTime, getUTCDayTime } = require('../utils');
function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}
class HomeController extends Controller {
  async getAll() {
    const ctx = this.ctx;
    try {
      const dayTime = getUTCYesterdayTime();
      const fundPool = await ctx.model.fundPool.findAll();
      this.sendBody({ dayTime, fundPool });
    } catch (error) {
      this.error(error);
    }
  }
  async delete() {
    const ctx = this.ctx;
    try {
      const time = getUTCDayTime();
      await ctx.model.fundPool.destroy({
        where: {
          time,
        },
      });
      this.sendBody();
    } catch (error) {
      this.error(error);
    }
  }
  async fundPoolDaySnapshot() {
    const ctx = this.ctx;
    try {
      const { limit, offset, id } = ctx.request.query;
      const query = {
        order: [['time', 'DESC']],
        limit: toInt(limit),
        offset: toInt(offset),
        ...(id ? { where: { address: id } } : {}),
      };
      this.sendBody(await ctx.model.fundPool.findAll(query));
    } catch (error) {
      this.error(error);
    }
  }
}

module.exports = HomeController;
