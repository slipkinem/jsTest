/**
 * Created by slipkinem on 1/25/2018 at 11:56 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import { Service } from 'egg'

export default class PostService extends Service {
  async get () {
    const posts = await this.app.mysql.get()
  }
}