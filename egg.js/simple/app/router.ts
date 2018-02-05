/**
 * Created by slipkinem on 1/24/2018 at 10:25 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import { Application } from 'egg'

export default ({ router, controller }: Application) => {
  router.get('/', controller.home.index)
  router.get('/news', controller.news.list)
}
