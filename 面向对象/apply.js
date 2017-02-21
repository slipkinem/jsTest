/**
 * Created by slipkinem on 2016/8/26.
 */

function Person(name) {
    this.name = name;
    this.say = function () {
        console.log(this.name);
    };
    console.log(this.name);
}
Person('lvsen');

function Teacher(name) {
    this.name = name;
}

var person = new Person('lvsen');
var teacher = new Teacher('lilei');
console.log(person);  //加new 等于创建了一个对象，等于将函数对象化，不加new等于取得函数的返回值
console.log(teacher);
person.say();
person.say.call(teacher);

person.say.apply(teacher,[]);
var x = new Person();
console.log(person);
