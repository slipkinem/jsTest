/**
 * Created by slipkinem on 1/24/2018 at 1:18 PM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import { Service } from 'egg'

export default class NewsService extends Service {
  async list (pageNum = 1) {
    const { serverUrl, pageSize } = this.app.config.news
    const { data: idList} = await this.ctx.curl(`${serverUrl}/topstories.json`, {
      data: {
        orderBy: '"$key"',
        startAt: `"${pageSize * (pageNum - 1)}"`,
        endAt: `"${pageSize * pageNum - 1}"`
      },
      dataType: 'json'
    })
    const newsList= await Promise.all(
        Object.keys(idList).map(key => {
          const url = `${serverUrl}/item/${idList[key]}.json`
          return this.ctx.curl(url, {
            dataType: 'json'
          })
        })
    )
    return newsList.map(res => res.data)
  }
}