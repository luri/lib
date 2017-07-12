class Todo extends luri.Component {

  constructor(text) {
    super();

    this.text = text || "";

    this.on("save", function(todos) {
      todos.push(this.text.value);
    });
  }

  onUnmount() {
    super.onUnmount();

    luri.emit("trigger-save");
  }

  props() {
    return {
      class: "todo-entry input-group",
      html: [
        luri.INPUT({
          value: this.text,
          class: "form-control rounded-0",
          ref: e => this.text = e,
          onchange: luri.emit.bind(null, "trigger-save")
        }),
        luri.BUTTON({
          html: luri.I({ class: "fa fa-check" }),
          class: "btn btn-outline-success rounded-0",
          onclick: luri.emit.bind(null, "remove-todo", this)
        })
      ]
    };
  }
}

class Container extends luri.Component {

  constructor() {
    super();

    this.on("add-todo", this.addTodo);
    this.on("remove-todo", this.removeTodo);
    this.on("trigger-save", this.saveTodos);
  }

  addTodo() {
    this.ref.appendChild(new Todo().construct());
  }

  removeTodo(component) {
    this.ref.removeChild(component.ref);
  }

  saveTodos() {
    var [todos] = luri.emit("save", []);
    console.log("saving", todos);
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  props() {
    var todos = JSON.parse((localStorage.getItem("todos") || "[]"));

    return {
      class: "todo-list mb-4",
      html: todos.map(todo => new Todo(todo))
    };
  }
}

class Actions extends luri.Component {

  constructor(container) {
    super();

    this.container = container;
  }

  props() {
    var c = this.container.ref;

    return {
      class: "actions d-flex justify-content-end",
      html: [
        luri.BUTTON({
          html: luri.I({ class: "fa fa-plus" }),
          class: "btn btn-secondary rounded-0 px-5",
          onclick: luri.emit.bind(null, "add-todo")
        })
      ]
    };
  }
}

var container = new Container,
  actions = new Actions(container);

document.body.appendChild(luri.construct({
  html: [
    {
      class: "jumbotron",
      html: [
        luri.H1("TODOs"),
        luri.P([
          "An example app built using ", luri.A({ href: "https://github.com/manix/luri", html: "luri" }), "."
        ])
      ]
    }, {
      class: "container-fluid py-2",
      html: [container, actions]
    }
  ]
}));
