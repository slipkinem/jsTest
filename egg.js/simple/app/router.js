"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ router, controller }) => {
    router.get('/', controller.home.index);
    router.get('/news', controller.news.list);
};
//# sourceMappingURL=router.js.map