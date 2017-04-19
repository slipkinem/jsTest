/**
 * Created by slipkinem on 2017/3/28.
 */

declare module Backbone {
  export class Model {
    // ?为可选参数
    constructor(attr?, opts?)

    get(name: string): any

    set(name: string, val: any): void
    set(obj: any): void

    save(attr?, opts?): void

    destroy(): void

    bind(env: string, f: Function, ctx?: any): void

    toJSON(): any
  }

  export class Collection<T> {
    constructor(models?, opts?)
    constructor(models?, opts?);

    bind(ev: string, f: Function, ctx?: any): void;

    length: number;

    create(attrs, opts?): any;

    each(f: (elem: T) => void): void;

    fetch(opts?: any): void;

    last(): T;
    last(n: number): T[];

    filter(f: (elem: T) => boolean): T[];

    without(...values: T[]): T[];
  }

  export class View {
    constructor(options?);

    $(selector: string): JQuery;

    el: HTMLElement;
    $el: JQuery;
    model: Model;

    remove(): void;

    delegateEvents: any;

    make(tagName: string, attrs?, opts?): View;

    setElement(element: HTMLElement, delegate?: boolean): void;
    setElement(element: JQuery, delegate?: boolean): void;

    tagName: string;
    events: any;

    static extend: any;
  }

}

interface JQuery {
  fadeIn(): JQuery;
  fadeOut(): JQuery;
  focus(): JQuery;
  html(): string;
  html(val: string): JQuery;
  show(): JQuery;
  addClass(className: string): JQuery;
  removeClass(className: string): JQuery;
  append(el: HTMLElement): JQuery;
  val(): string;
  val(value: string): JQuery;
  attr(attrName: string): string;
}

declare let $: {
  (el: HTMLElement): JQuery
  (selector: string): JQuery
  (readyCallback: () => void): JQuery
}

declare let _: {
  each<T, U>(arr: T[], f: (elem: T) => U): U[]
  delay(f: Function, wait: number, ...arguments: any[]): number
  template(template: string): (model: any) => string
  bindAll(object: any, ...methodNames: string[]): void
}

declare let Store: any

class Todo extends Backbone.Model {
  defaults() {
    return {
      content: 'empty todo...',
      done: false
    }
  }

  initialize() {
    if (!this.get('content')) {
      this.set({
        'content': this.defaults().content
      })
    }
  }

  toggle() {
    this.save({
      done: !this.get('done')
    })
  }

  clear() {
    this.destroy()
  }

}

class TodoList extends Backbone.Collection<Todo> {
  model = Todo
  localStorage = new Store('todos-backbone')

  done() {
    return this.filter(todo => todo.get('done'))
  }

  remaining() {
    return this.without.apply(this, this.done())
  }

  nextOrder() {
    if (!this.length) return 1
    return this.last().get('order') + 1
  }

  comparator(todo: Todo) {
    return todo.get('order')
  }

}

var Todos = new TodoList()

class TodoView extends Backbone.View {
  template: (data: any) => string

  model: Todo
  input: JQuery

  constructor(options?) {
    super(options)
    this.tagName = 'li'

    this.events = {
      "click .check": "toggleDone",
      "dblclick label.todo-content": "edit",
      "click span.todo-destroy": "clear",
      "keypress .todo-input": "updateOnEnter",
      "blur .todo-input": "close"
    }

    this.template = _.template($('#item-template').html())
    _.bindAll(this, 'render', 'close', 'remove')
    this.model.bind('change', this.render)
    this.model.bind('destroy', this.remove)
  }

  render() {
    this.$el.html(this.template(this.model.toJSON()))
    return this
  }

  toggleDone() {
    this.model.toggle()
  }

  edit() {
    this.$el.addClass('editing')
  }

  close() {
    this.model.save({
      content: this.input.val()
    })
  }

  updateOnEnter(e) {
    if (e.keyCode === 13) close()
  }

  clear() {
    this.model.clear()
  }

}

class AppView extends Backbone.View {
  events = {
    "keypress #new-todo": "createOnEnter",
    "keyup #new-todo": "showTooltip",
    "click .todo-clear a": "clearCompleted",
    "click .mark-all-done": "toggleAllComplete"
  }

  private input: JQuery
  private allCheckbox: HTMLInputElement
  private statsTemplate: (params: any) => string

  constructor() {
    super()
    this.setElement($('#todoapp'), true)

    _.bindAll(this, 'addOne', 'addAll', 'render', 'toggleAllComplete')
    this.input = this.$('#new-todo')
    this.allCheckbox = this.$('.mark-all-done')[0]
    this.statsTemplate = _.template($('#stats-template').html())

    Todos.bind('add', this.addOne)
    Todos.bind('reset', this.addAll)
    Todos.bind('all', this.render)

    Todos.fetch()
  }

  render() {
    var done = Todos.done().length
    var remaining = Todos.remaining().length

    this.$('#todo-stats').html(this.statsTemplate({
      total: Todos.length,
      done,
      remaining
    }))

    this.allCheckbox.checked = !remaining
  }

  addOne(todo) {
    var view = new TodoView({model: todo})
    this.$('#todo-list').append(view.render().el)
  }

  addAll() {
    Todos.each(this.addOne)
  }

  newAttribute() {
    return {
      content: this.input.val(),
      order: Todos.nextOrder(),
      done: false
    }
  }

  createOnEnter(e) {
    if (e.keyCode != 13) return
    Todos.create(this.newAttribute())
    this.input.val('')
  }

  clearCompleted() {
    _.each(Todos.done(), todo => todo.clear())
    return false
  }

  tooltipTimeout: number = null

  showTooltip(e) {
    var tooltip = $('.ui-tooltip-top')
    var val = this.input.val()
    tooltip.fadeOut()
    if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout)
    if (val == '' || val == this.input.attr('placeholder')) return
    this.tooltipTimeout = _.delay(() => tooltip.show().fadeOut(), 1000)
  }

  toggleAllComplete() {
    var done = this.allCheckbox.checked
    Todos.each(todo => todo.save({
      done
    }))

  }

}

$(() => {
  new AppView()
})