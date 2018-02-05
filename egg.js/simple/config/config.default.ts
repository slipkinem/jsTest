/**
 * Created by slipkinem on 1/24/2018 at 10:29 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import { EggAppConfig } from 'egg'

export class ConfigDefault {
  keys = 'slipkinem'
  view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks'
    }
  }
  news = {
    pageSize: 5,
    serverUrl: 'https://hacker-news.firebaseio.com/v0'
  }
  mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'slipkinem',
      password: '123456',
      database: 'vue_admin'
    },
    app: true,
    agent: false
  }
}

export default new ConfigDefault()

declare module 'egg' {
  export interface Application {
    config: EggAppConfig & ConfigDefault
  }
}