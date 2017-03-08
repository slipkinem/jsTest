var object = {
  isA: function (aType) {
    // body...
    var self = this;
    console.info(this);
    while (self) {
      if (self == aType)
        return true;
      self = self.Type;
    }
    return false;
  }
};
class Listen {
  constructor(height, width) {
    this.height = height
    this.width = width
  }
}

let listen = new Listen(23, 34)
console.log(listen)


function Class(aBaseClass, aClassDefine) {
  function class_() {
    this.Type = aBaseClass;
    for (var member in aClassDefine) {
      this[member] = aClassDefine[member];
    }
  }

  class_.prototype = aBaseClass;
  return new class_();
}

function New(aClass, aParams) {
  function new_() {
    this.Type = aClass;

    if (aClass.Create)
      aClass.Create.apply(this, aParams);
  }

  new_.prototype = aClass;
  return new new_();
}


var Person = Class(object, {
  Create: function (name, age) {
    this.name = name;
    this.age = age;
  },
  SayHello: function () {
    console.dir('this.name= ' + this.name + ' this.age= ' + this.age);
  }
});

var Employee = Class(Person, {
  Create: function (name, age, salary) {
    Person.Create.call(this, name, age);
    this.salary = salary;
  },
  ShowMeTheMoney: function () {
    console.dir(this.name + ' $ ' + this.salary);
  }
});

var lvsen = New(Person, ["lvsen", 43]);
var zhangsan = New(Employee, ["zhangsan", 53, 345]);

lvsen.SayHello();
zhangsan.SayHello();
zhangsan.ShowMeTheMoney();

var smallLvsen = New(lvsen.Type, ['smallLvsen', 34]);
smallLvsen.SayHello();

console.dir(lvsen.isA(Person));
console.dir(lvsen.isA(Employee));
console.dir(zhangsan.isA(Person));
console.dir(zhangsan.isA(Employee));
console.dir(smallLvsen.isA(Person));
console.dir(smallLvsen.isA(Employee));
