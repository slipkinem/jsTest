/**
 * Created by slipkinem on 2017/3/28.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Todo = (function (_super) {
    __extends(Todo, _super);
    function Todo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Todo.prototype.defaults = function () {
        return {
            content: 'empty todo...',
            done: false
        };
    };
    Todo.prototype.initialize = function () {
        if (!this.get('content')) {
            this.set({
                'content': this.defaults().content
            });
        }
    };
    Todo.prototype.toggle = function () {
        this.save({
            done: !this.get('done')
        });
    };
    Todo.prototype.clear = function () {
        this.destroy();
    };
    return Todo;
}(Backbone.Model));
var TodoList = (function (_super) {
    __extends(TodoList, _super);
    function TodoList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.model = Todo;
        _this.localStorage = new Store('todos-backbone');
        return _this;
    }
    TodoList.prototype.done = function () {
        return this.filter(function (todo) { return todo.get('done'); });
    };
    TodoList.prototype.remaining = function () {
        return this.without.apply(this, this.done());
    };
    TodoList.prototype.nextOrder = function () {
        if (!this.length)
            return 1;
        return this.last().get('order') + 1;
    };
    TodoList.prototype.comparator = function (todo) {
        return todo.get('order');
    };
    return TodoList;
}(Backbone.Collection));
var Todos = new TodoList();
var TodoView = (function (_super) {
    __extends(TodoView, _super);
    function TodoView(options) {
        var _this = _super.call(this, options) || this;
        _this.tagName = 'li';
        _this.events = {
            "click .check": "toggleDone",
            "dblclick label.todo-content": "edit",
            "click span.todo-destroy": "clear",
            "keypress .todo-input": "updateOnEnter",
            "blur .todo-input": "close"
        };
        _this.template = _.template($('#item-template').html());
        _.bindAll(_this, 'render', 'close', 'remove');
        _this.model.bind('change', _this.render);
        _this.model.bind('destroy', _this.remove);
        return _this;
    }
    TodoView.prototype.render = function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    };
    TodoView.prototype.toggleDone = function () {
        this.model.toggle();
    };
    TodoView.prototype.edit = function () {
        this.$el.addClass('editing');
    };
    TodoView.prototype.close = function () {
        this.model.save({
            content: this.input.val()
        });
    };
    TodoView.prototype.updateOnEnter = function (e) {
        if (e.keyCode === 13)
            close();
    };
    TodoView.prototype.clear = function () {
        this.model.clear();
    };
    return TodoView;
}(Backbone.View));
var AppView = (function (_super) {
    __extends(AppView, _super);
    function AppView() {
        var _this = _super.call(this) || this;
        _this.events = {
            "keypress #new-todo": "createOnEnter",
            "keyup #new-todo": "showTooltip",
            "click .todo-clear a": "clearCompleted",
            "click .mark-all-done": "toggleAllComplete"
        };
        _this.tooltipTimeout = null;
        _this.setElement($('#todoapp'), true);
        _.bindAll(_this, 'addOne', 'addAll', 'render', 'toggleAllComplete');
        _this.input = _this.$('#new-todo');
        _this.allCheckbox = _this.$('.mark-all-done')[0];
        _this.statsTemplate = _.template($('#stats-template').html());
        Todos.bind('add', _this.addOne);
        Todos.bind('reset', _this.addAll);
        Todos.bind('all', _this.render);
        Todos.fetch();
        return _this;
    }
    AppView.prototype.render = function () {
        var done = Todos.done().length;
        var remaining = Todos.remaining().length;
        this.$('#todo-stats').html(this.statsTemplate({
            total: Todos.length,
            done: done,
            remaining: remaining
        }));
        this.allCheckbox.checked = !remaining;
    };
    AppView.prototype.addOne = function (todo) {
        var view = new TodoView({ model: todo });
        this.$('#todo-list').append(view.render().el);
    };
    AppView.prototype.addAll = function () {
        Todos.each(this.addOne);
    };
    AppView.prototype.newAttribute = function () {
        return {
            content: this.input.val(),
            order: Todos.nextOrder(),
            done: false
        };
    };
    AppView.prototype.createOnEnter = function (e) {
        if (e.keyCode != 13)
            return;
        Todos.create(this.newAttribute());
        this.input.val('');
    };
    AppView.prototype.clearCompleted = function () {
        _.each(Todos.done(), function (todo) { return todo.clear(); });
        return false;
    };
    AppView.prototype.showTooltip = function (e) {
        var tooltip = $('.ui-tooltip-top');
        var val = this.input.val();
        tooltip.fadeOut();
        if (this.tooltipTimeout)
            clearTimeout(this.tooltipTimeout);
        if (val == '' || val == this.input.attr('placeholder'))
            return;
        this.tooltipTimeout = _.delay(function () { return tooltip.show().fadeOut(); }, 1000);
    };
    AppView.prototype.toggleAllComplete = function () {
        var done = this.allCheckbox.checked;
        Todos.each(function (todo) { return todo.save({
            done: done
        }); });
    };
    return AppView;
}(Backbone.View));
$(function () {
    new AppView();
});
//# sourceMappingURL=todos.js.map