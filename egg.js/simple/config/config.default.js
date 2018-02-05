"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigDefault {
    constructor() {
        this.keys = 'slipkinem';
        this.view = {
            defaultViewEngine: 'nunjucks',
            mapping: {
                '.tpl': 'nunjucks'
            }
        };
        this.news = {
            pageSize: 5,
            serverUrl: 'https://hacker-news.firebaseio.com/v0'
        };
        this.mysql = {
            client: {
                host: 'localhost',
                port: '3306',
                user: 'slipkinem',
                password: '123456',
                database: 'vue_admin'
            },
            app: true,
            agent: false
        };
    }
}
exports.ConfigDefault = ConfigDefault;
exports.default = new ConfigDefault();
//# sourceMappingURL=config.default.js.map