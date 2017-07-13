/**
 * Created by slipkinem on 2017/3/28.
 */
'use strict';
function greeter(person) {
    return 'hello, ' + person.firstName + ' ' + person.lastName;
}
var user = {
    firstName: 'jane',
    lastName: 'user'
};
console.log(greeter(user));
