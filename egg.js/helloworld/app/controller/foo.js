/**
 * Created by slipkinem on 1/24/2018 at 11:23 AM.
 */
'use strict'

const Controller = require('egg').Controller;

class FooController extends Controller {
  async render() {
    const ctx = this.ctx;

    ctx.body = 'Hello foo';
  }
}

module.exports = FooController;