/**
 * Created by slipkinem on 1/23/2018 at 5:11 PM.
 */
const { Controller } = require('egg')

class HomeController extends Controller {
  async index () {
    this.ctx.body = 'hello world'
  }
}

module.exports = HomeController