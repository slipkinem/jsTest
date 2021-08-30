// // /**
// //  * Created by sen.lv on 2021/5/21 at 14:18.
// //  */
// (function() {
//   var ContinueSentinel = {};
//
//   var mark = function(genFun) {
//     var generator = Object.create({
//       next: function(arg) {
//         return this._invoke("next", arg);
//       }
//     });
//     genFun.prototype = generator;
//     return genFun;
//   };
//
//   function wrap(innerFn, outerFn) {
//     var generator = Object.create(outerFn.prototype);
//
//     var context = {
//       done: false,
//       method: "next",
//       next: 0,
//       prev: 0,
//       abrupt: function(type, arg) {
//         var record = {};
//         record.type = type;
//         record.arg = arg;
//
//         return this.complete(record);
//       },
//       complete: function(record, afterLoc) {
//         if (record.type === "return") {
//           this.rval = this.arg = record.arg;
//           this.method = "return";
//           this.next = "end";
//         }
//
//         return ContinueSentinel;
//       },
//       stop: function() {
//         this.done = true;
//         return this.rval;
//       }
//     };
//
//     generator._invoke = makeInvokeMethod(innerFn, context);
//
//     return generator;
//   }
//
//   function makeInvokeMethod(innerFn, context, self) {
//     var state = "start";
//
//     return function invoke(method, arg) {
//       if (state === "completed") {
//         return { value: undefined, done: true };
//       }
//
//       context.method = method;
//       context.arg = arg;
//
//       while (true) {
//         state = "executing";
//
//         var record = {
//           type: "normal",
//           arg: innerFn.call(self, context)
//         };
//
//         if (record.type === "normal") {
//           state = context.done ? "completed" : "yield";
//
//           if (record.arg === ContinueSentinel) {
//             continue;
//           }
//
//           return {
//             value: record.arg,
//             done: context.done
//           };
//         }
//       }
//     };
//   }
//
//   global.regeneratorRuntime = {};
//
//   regeneratorRuntime.wrap = wrap;
//   regeneratorRuntime.mark = mark;
// })();
//
// var _marked = regeneratorRuntime.mark(helloWorldGenerator);
//
// function helloWorldGenerator() {
//   return regeneratorRuntime.wrap(
//     function helloWorldGenerator$(_context) {
//       while (1) {
//         switch ((_context.prev = _context.next)) {
//           case 0:
//             _context.next = 2;
//             return "hello";
//
//           case 2:
//             _context.next = 4;
//             return "world";
//
//           case 4:
//             return _context.abrupt("return", "ending");
//
//           case 5:
//           case "end":
//             return _context.stop();
//         }
//       }
//     },
//     _marked,
//     this
//   );
// }
//
// var hw = helloWorldGenerator();
//
// console.log(hw.next());
// console.log(hw.next());
// console.log(hw.next());
// console.log(hw.next());


function * gen () {
  yield Promise.resolve(123123)
  const x = yield Promise.resolve(123)
  console.log(x)
}

const t = gen()
// console.log(t.next())
// console.log(t.next())
// console.log(t.next())
// console.log(t.next())
// console.log(t.next())
// console.log(t.next())

function gen$ () {
  let x = undefined;
  let next = 0;

  let r = {
    value: undefined,
    done: false
  }

  return {
    next: (p) => {
      switch (next) {
        case 0:
          next = 2;
          r.value = Promise.resolve(123123)
          r.done = false
          return r
        case 2:
          next = 4;
          r.value = Promise.resolve(123)
          r.done = false
          return r
        case 4:
          next = 6;
          x = p;
          console.log(x);
          return x;
        case 6:
          r.done = true;
          r.value = undefined
          return r;
      }
    }
  }
}

function co (gen) {
  let ret = gen.call(this, null)

  next()

  function next (r) {
    let o = ret.next(r)
    if (o.done) return

    if (o.value instanceof Promise) {
      o.value.then(next)
    } else {

    }
  }
}

co(gen$)
// console.log(x.next())
// console.log(x.next())
// console.log(x.next())
// console.log(x.next())
