const assert = require("assert");
const luri = require("../src/luri");
const JSDOM = require("jsdom").JSDOM;
const dom = new JSDOM(`<!DOCTYPE html>`);
global.document = dom.window.document;

class MyComponent extends luri.Component {

  constructor() {
    super();
    this.on("test", this.test);
    this.on("change", this.change);
    this.class = "test";
  }

  test(payload) {
    payload.push(true);
  }

  change(value) {
    this.class = value;
    this.reconstruct();
  }

  props() {
    return {
      class: this.class,
      html: [
        { node: "span", html: "1st" },
        { node: "span", html: "2nd" }
      ]
    };
  }
}


describe("Constructing", function() {

  it("From string", function() {
    assert.equal(luri.construct("dgd").nodeName, "#text");
  });

  it("From integer", function() {
    let element = luri.construct(5);

    assert.equal(element.nodeName, "#text");
    assert.equal(element.textContent, "5");
  })

  it("From object", function() {
    let listener = function() {};
    let element = luri.construct({
      node: "button",
      class: "dgd",
      html: "brat",
      onclick: listener,
    });

    assert.strictEqual(element.nodeName, "BUTTON", "nodeName");
    assert.equal(element.className, "dgd", "className");
    assert.equal(element.innerHTML, "brat", "innerHTML");
    assert.strictEqual(element.onclick, listener, "onclick");
  });

  it("From Component", function() {
    let component = new MyComponent();
    let element = component.construct();

    assert.equal(element.nodeName, "DIV", "nodeName");
    assert.equal(element.children.length, 2, "children");
    assert(element.classList.contains(luri.class), "Must contain luri component class");
  });

  it("Reconstruct Component", function() {
    let component = new MyComponent();

    assert.throws(component.reconstruct, "Can not reconstruct .+", "Must throw");

    let element = component.construct();

    assert.equal(element, component.ref, "Bind check 1");
    assert.equal(element.luri, component, "Bind check 2");

    component.reconstruct();

    assert.notEqual(element, component.ref, "New and old must differ");
    assert.equal(element.nodeName, component.ref.nodeName, "Node names of new and old");
  });
});

describe("Helpers", function() {

  it("From string", function() {
    assert.deepEqual(luri.SPAN("test"), { node: "SPAN", html: "test" });
  });

  it("From integer", function() {
    assert.deepEqual(luri.SPAN(5), { node: "SPAN", html: 5 });
  });

  it("From object", function() {
    assert.deepEqual(luri.SPAN({ class: "test" }), { node: "SPAN", class: "test" });
  });

  it("Nested", function() {
    assert.deepEqual(luri.SPAN(luri.SPAN("test")), { node: "SPAN", html: { node: "SPAN", html: "test" } });
  });

});

describe("Events", function() {

  it("Listeners", function() {
    let component = new MyComponent();
    let listeners = component.getEventListeners("test");

    assert.equal(listeners.length, 1, "Must have 1 listener"),
      assert.equal(typeof listeners[0], "function", "Listener must be a function");
  });

  it("Emission", function() {
    let data = [];
    let result = luri.emit("test", data);

    assert.equal(result.length, 1, "Result must be array with passed arguments");
    assert.strictEqual(result[0], data, "Passed and returned data must be the same");
  });

});

describe("DOM", function() {

  it("Append", function() {
    let component = new MyComponent();

    document.body.appendChild(component.construct());

    assert.equal(document.body.children.length, 1, "Body must have 1 child at this point");
    assert.equal(document.body.firstElementChild, component.ref, "Child must be our component's element");
  });

  it("Events", function() {
    // component already part of the document

    let [[mustBeTrue]] = luri.emit("test", []);

    assert.strictEqual(mustBeTrue, true, "Component must push boolean value");
  });

  it("Dispatch", function() {
    let newClass = "special-class";
    luri.emit("change", newClass);

    let component = new MyComponent();
    document.body.appendChild(component.construct());

    let [emitResult] = luri.emit("test", []);
    assert.equal(emitResult.length, 2, "Both components on the document must react to emit");

    let [dispatchResult] = luri.dispatchToClass(newClass, "test", []);
    assert.equal(dispatchResult.length, 1, "Only modified component should react to this dispatch");
  });

  it("Reconstruct", function() {
    // first component was reconstructed in "change" event
    assert.equal(document.body.children.length, 2, "Must have 2 children at this point");
  });

  it("Mount", function() {
    assert(document.body.firstElementChild.luri.isMounted(), "Component should be mounted");
    assert.strictEqual(new MyComponent().isMounted(), false, "Component should not be mounted");
  });
})
