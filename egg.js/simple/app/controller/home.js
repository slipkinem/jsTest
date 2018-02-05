"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by slipkinem on 1/24/2018 at 10:21 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
const egg_1 = require("egg");
class HomeController extends egg_1.Controller {
    async index() {
        this.ctx.body = 'hello world fuck you';
    }
}
exports.default = HomeController;
//# sourceMappingURL=home.js.map