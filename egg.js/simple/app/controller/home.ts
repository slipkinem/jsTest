/**
 * Created by slipkinem on 1/24/2018 at 10:21 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import { Controller } from 'egg'

export default class HomeController extends Controller {
  async index () {
    this.ctx.body = 'hello world fuck you'
  }
}
