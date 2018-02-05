/**
 * Created by slipkinem on 1/24/2018 at 1:30 PM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
import NewsService from './news'

declare module 'egg' {

  export interface IService {
    news: NewsService
  }
}