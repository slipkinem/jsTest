"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by slipkinem on 1/25/2018 at 11:56 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
const egg_1 = require("egg");
class PostService extends egg_1.Service {
    async get() {
        const posts = await this.app.mysql.get();
    }
}
exports.default = PostService;
//# sourceMappingURL=post.js.map