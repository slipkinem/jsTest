/**
 * Created by slipkinem on 2017/3/28.
 */
'use strict'

// function greeter(person: Array<number>) {
//   return 'hello, ' + person
// }
//
// var user = [0, 1]
//
// document.body.innerHTML = greeter(user)

interface Person {
  firstName: string
  lastName: string
}

function greeter(person: Person) {
  return 'hello, ' + person.firstName + ' ' + person.lastName
}

let user: Person = {
  firstName: 'jane',
  lastName: 'user'
}

console.log(greeter(user))