/**
 * Created by slipkinem on 1/3/2018 at 3:10 PM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
function sealed (constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class Greeter {
  greeting: string

  constructor (message: string) {
    this.greeting = message
  }

  greet () {
    return 'hello, ' + this.greeting
  }
}
