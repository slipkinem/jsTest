/**
 * Created by slipkinem on 1/23/2018 at 5:13 PM.
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
}