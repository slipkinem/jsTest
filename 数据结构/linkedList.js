/**
 * 链表 head => x => x => x
 * Created by slipkinem on 8/10/2017 at 11:27 AM.
 */
'use strict'
var log = console.log

function Node (element) {
  this.element = element
  this.next = null
}

function LinkedList () {
  this.head = new Node('head')
}

LinkedList.prototype = {
  constructor: 'LinkedList',
  find: function (item) {
    var currentNode = this.head

    while (currentNode.element !== item) {
      currentNode = currentNode.next
    }

    return currentNode
  },
  insert: function (newElement, item) {
    var newNode = new Node(newElement),
      current = this.find(item)
    newNode.next = current.next
    current.next = newNode
  },
  display: function () {
    var currentNode = this.head
    while (currentNode.next !== null) {
      log(currentNode.next.element)
      currentNode = currentNode.next
    }
  },
  findPrevious: function (item) {
    var currentNode = this.head

    while (currentNode.next !== null && (currentNode.next.element !== item)) {
      currentNode = currentNode.next
    }

    return currentNode
  },
  remove: function (item) {
    var prevNode = this.findPrevious(item)
    if (prevNode !== null) {
      prevNode.next = prevNode.next.next
    }
  }
}

var cities = new LinkedList()
cities.insert("conway", "head")
cities.insert("russellville", "conway")
cities.insert("alma", "russellville")
cities.insert("lvsen", "head")
cities.display()
log('-------------------remove-----------------')
cities.remove('alma')
cities.display()

