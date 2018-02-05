/**
 * Created by slipkinem on 1/24/2018 at 10:28 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import HomeController from './home'
import NewsController from './news'

declare module 'egg' {

  export interface IController {
    home: HomeController
    news: NewsController
  }
}