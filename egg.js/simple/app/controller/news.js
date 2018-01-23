/**
 * Created by slipkinem on 1/23/2018 at 5:33 PM.
 */
import { Controller } from 'egg'

export default class NewsController extends Controller {
  async list () {
    const dataList = {
      list: [
        { id: 1, title: 'this is news 1', url: '/news/1' },
        { id: 2, title: 'this is news 2', url: '/news/1' }
      ]
    }
    await this.ctx.render('news/list.tpl', dataList)
  }
}