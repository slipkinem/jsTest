/**
 * Created by slipkinem on 2/2/2018 at 6:05 PM.
 * Copyright © 2016, PuKang Health Maintenance Co.
 */
interface SealedOptions {
  name: string
  body?: string
}

function sealed <V extends SealedOptions> (options: SealedOptions): any {
  return function (constructor: Function) {
    console.log(constructor.toString())
  }
}

@sealed({
  name: 'fsdf',
  body: 'fsdfdsf'
})
class Greeter {
  greeting: string

  constructor (message: string) {
    this.greeting = message
  }

  greet () {
    return 'hello, ' + this.greeting
  }
}

// console.log(new Greeter('test'))
