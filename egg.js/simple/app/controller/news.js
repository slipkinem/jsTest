"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by slipkinem on 1/24/2018 at 11:56 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
const egg_1 = require("egg");
class NewsController extends egg_1.Controller {
    async list() {
        const { ctx } = this;
        const pageNum = ctx.query.page || 1;
        const newsList = await ctx.service.news.list(pageNum);
        await ctx.render('news/list.tpl', {
            list: newsList
        });
    }
}
exports.default = NewsController;
//# sourceMappingURL=news.js.map