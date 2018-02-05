/**
 * Created by slipkinem on 1/24/2018 at 11:56 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import { Controller } from 'egg'

export default class NewsController extends Controller {
  async list () {
    const { ctx } = this
    const pageNum = ctx.query.page || 1
    const newsList = await ctx.service.news.list(pageNum)
    await ctx.render('news/list.tpl', {
      list: newsList
    })
  }
}