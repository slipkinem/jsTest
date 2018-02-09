/**
 * Created by slipkinem on 2/8/2018 at 11:22 AM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
function noop () {
}

interface IRoutes {
  [key: string]: () => void
}

class Router {
  routes: IRoutes = {}
  currentUrl = ''

  route (path, callback = noop) {
    this.routes[path] = callback
  }

  refresh () {
    console.log('触发一次 hashchange, hash = ', location.hash)
    this.currentUrl = location.hash.slice(1) || '/'
    this.routes[this.currentUrl]()
  }

  init () {
    window.addEventListener('load', this.refresh.bind(this), false)
    window.addEventListener('hashchange', this.refresh.bind(this), false)
  }
}

window.onload = main

function main () {
  let router = new Router()
  router.init()

  let content = document.querySelector('body')

  function changeColor (color: string) {
    content.style.backgroundColor = color
  }

  router.route('/', function () {
    changeColor('white')
  })

  router.route('/blue', function () {
    changeColor('blue')
  })

  router.route('/green', function () {
    changeColor('green')
  })
}
