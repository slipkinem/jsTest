// /**
//  * Created by slipkinem on 2016/8/26.
//  */
//
// function Person(name) {
//     this.name = name;
//     this.say = function () {
//         console.log(this.name);
//     };
//     console.log(this.name);
// }
// Person('lvsen');
//
// function Teacher(name) {
//     this.name = name;
// }
//
// var person = new Person('lvsen');
// var teacher = new Teacher('lilei');
// console.log(person);  //加new 等于创建了一个对象，等于将函数对象化，不加new等于取得函数的返回值
// console.log(teacher);
// person.say();
// person.say.call(teacher);
//
// person.say.apply(teacher,[]);
// var x = new Person();
// console.log(person);

// function hanoi (n, a, b, c) {

//
//   if (n === 1) {
//     console.log(a + ' ------> ' + c)
//   } else {
//     hanoi(n - 1, a, c, b)
//     hanoi(1, a, b, c)
//     hanoi(n - 1, b, a, c)
//   }
// }
//
// var start = +new Date()
// console.log(start)
// hanoi(10, 'A', 'B', 'C')
// console.log('用的时间 ' + (+new Date() - start))
var path = require('path')
console.log(path.join(__dirname, '../node/static'))
console.log(path.resolve(__dirname, '../node/static'))
