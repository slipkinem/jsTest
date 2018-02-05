/**
 * Created by slipkinem on 1/24/2018 at 11:24 AM.
 */
'use strict'

module.exports = app => {
  app.router.get('/', app.controller.home.render);
  app.router.get('/foo', app.controller.foo.render);
};