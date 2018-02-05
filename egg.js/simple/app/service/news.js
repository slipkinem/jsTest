"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by slipkinem on 1/24/2018 at 1:18 PM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
const egg_1 = require("egg");
class NewsService extends egg_1.Service {
    async list(pageNum = 1) {
        const { serverUrl, pageSize } = this.app.config.news;
        const { data: idList } = await this.ctx.curl(`${serverUrl}/topstories.json`, {
            data: {
                orderBy: '"$key"',
                startAt: `"${pageSize * (pageNum - 1)}"`,
                endAt: `"${pageSize * pageNum - 1}"`
            },
            dataType: 'json'
        });
        const newsList = await Promise.all(Object.keys(idList).map(key => {
            const url = `${serverUrl}/item/${idList[key]}.json`;
            return this.ctx.curl(url, {
                dataType: 'json'
            });
        }));
        return newsList.map(res => res.data);
    }
}
exports.default = NewsService;
//# sourceMappingURL=news.js.map