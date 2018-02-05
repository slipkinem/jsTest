/**
 * Created by slipkinem on 1/24/2018 at 11:24 AM.
 */
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async render() {
    const ctx = this.ctx;

    ctx.body = 'Hello World';
  }
}

module.exports = HomeController;