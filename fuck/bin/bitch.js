#!/usr/bin/env node
var fs = require('fs'),
  path = require('path')
var appInfo = require('../package.json')

const cmd = require('commander')


cmd.version(appInfo.version)
  .option('-i, --index <n>', 'ascii art index, default is random', -1, parseInt)
  .option('-t, --type <vlaue>', '[quotes|jokes|tang|song]', 'quotes', /^(quotes|jokes|tang|song)$/i)
  .on('--help', function () {
    console.log('\t' + appInfo.repository.url)
  })
  .parse(process.argv)

var animals = fs.readFileSync(path.join(__dirname, '../data/animals.txt')).toString()
  .split('=====================================================================================\n')
var jokes = fs.readFileSync(path.join(__dirname, '../data/jokes.txt')).toString().split('%')

function randomAnimals () {
  return animals[Math.floor(Math.random() * animals.length)]
}

function prefix (type) {
  switch (type) {
    case 'jokes':
      return jokes[Math.floor(Math.random() * jokes.length)]
      break
    default:
      return jokes[Math.floor(Math.random() * jokes.length)]
  }
}

var animal = cmd.index === -1 ? randomAnimals() : animals[cmd.index]
console.log(prefix(cmd.type))
console.log(animal)

