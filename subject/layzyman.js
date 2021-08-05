/**
 * Created by sen.lv on 2021/6/16 at 10:55.
 */
function LazyMan (name) {
  this.subs = []
  if (!(this instanceof LazyMan)) {
    return new LazyMan(name)
  }
  const loop = () => {
    const sub = this.subs.shift()
    if (sub) {
      sub().then(loop)
    }
  }
  setTimeout(() => {
    loop()
  })
  return this
}

LazyMan.prototype = {
  eat(food) {
    this.subs.push(() => new Promise(resolve => {
      console.log('eat ' + food)
      resolve()
    }))
    return this
  },

  sleep(time) {
    this.subs.push(() => new Promise(resolve => {
      setTimeout(() => {
        console.log('sleep', time)
        resolve()
      }, time*1000)
    }))
    return this
  },
  sleepFirst(time) {
    this.subs.unshift(() => new Promise(resolve => {
      setTimeout(() => {
        console.log('sleepFirst', time)
        resolve()
      }, time*1000)
    }))
    return this
  }
}


LazyMan('fuck').eat('shi').sleep(5).eat('niao').sleepFirst(3).eat('234')

function LazyMan (name) {
  console.log(name);
  LazyMan.subs = [];

  LazyMan.sub = (event, cb) => {
    if (event === 'sleepFirst') {
      return LazyMan.subs.unshift(cb);
    }
    LazyMan.subs.push(cb);
  };

  setTimeout(() => {
    LazyMan.next()
  });

  return LazyMan;
}

LazyMan.next = () => {
  const sub = LazyMan.subs.shift()
  sub && sub()
}


LazyMan.eat = (food) => {
  LazyMan.sub('eat', () => {
    console.log(food);
    LazyMan.next();
  });
  return LazyMan
};


LazyMan.sleep = (time) => {
  LazyMan.sub('sleep', () =>
    setTimeout(() => {
      console.log('sleep');
      LazyMan.next();
    }, time * 1000));
  return LazyMan
};

LazyMan.sleepFirst = (time) => {
  LazyMan.sub('sleepFirst', () =>
    setTimeout(() => {
      console.log('sleepFirst');
      LazyMan.next();
    }, time * 1000));
  return LazyMan
};

LazyMan('fuck').eat('shi').sleep(5).eat('niao').sleepFirst(3).eat('234');


