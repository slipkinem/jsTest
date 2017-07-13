/**
 * Created by HASEE on 6/10/2017.
 */
var Observer = require('./index')
var Promise = require('./promise')

var observer = new Observer()

observer.subscribe('吃饭', function (stuff) {
    console.log(stuff)
})

setTimeout(function () {
    observer.publish('吃饭', '面条')
}, 2000)
// observer.subscribe('heshui')

// $('#modal').on('show.modal', function () {
//     console.log('sdfds')
// })
//
// $('#id').on('click', function (event) {
//
// })
//
// $.emit('click', event)
new Promise(function (resolve) {
    setTimeout(function () {
        resolve('apple')
    }, 2000)
})
    .then(function (stuff) {
        console.log(stuff)
    })
