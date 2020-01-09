const assert = require("assert");
const luri = require("../src/luri");
const JSDOM = require("jsdom").JSDOM;
const dom = new JSDOM(`<!DOCTYPE html>`);
global.document = dom.window.document;
global.Element = dom.window.Element;

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
      html: [{
        node: "span",
        html: "1st"
      },
      {
        node: "span",
        html: "2nd"
      }
      ]
    };
  }
}


describe("Constructing", function () {

  it("From string", function () {
    assert.equal(luri.construct("dgd").nodeName, "#text");
  });

  it("From integer", function () {
    let element = luri.construct(5);

    assert.equal(element.nodeName, "#text");
    assert.equal(element.textContent, "5");
  })

  it("From object", function () {
    let listener = function () { };
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

  it("From Component", function () {
    let component = new MyComponent();
    let element = component.construct();

    assert.equal(element.nodeName, "DIV", "nodeName");
    assert.equal(element.children.length, 2, "children");
    assert(element.classList.contains(luri.class), "Must contain luri component class");
  });

  it("Reconstruct Component", function () {
    let component = new MyComponent();

    assert.throws(() => {
      component.reconstruct();
    }, /Can not reconstruct .+/, "Must throw");

    let element = component.construct();

    assert.equal(element, component.ref, "Bind check 1");
    assert.equal(element.luri, component, "Bind check 2");

    component.reconstruct();

    assert.notEqual(element, component.ref, "New and old must differ");
    assert.equal(element.nodeName, component.ref.nodeName, "Node names of new and old");
  });

  it("From Constructed Component", function () {
    let component = new MyComponent();
    let element = component.construct();

    assert.equal(element, luri.construct(component));
  });

  it("From Element", function () {
    let element = document.createElement("div");

    assert.deepEqual(element, luri.construct(element));
  });

  it("From Promise", function (done) {
    let promise = new Promise(resolve => {
      setTimeout(() => resolve({
        html: "As promised!"
      }), 100);
    });

    let element = luri.construct({
      html: luri.promise({
        class: "loading",
        ref: e => assert(e.classList.contains("loading"))
      }, promise)
    });

    let instant = luri.construct({
      html: Promise.resolve({
        html: "instant"
      })
    });

    setTimeout(() => {
      assert.equal(element.children[0].innerHTML, "As promised!");
      assert.equal(instant.children[0].innerHTML, "instant");
      done();
    }, 200);

  });

  it("From NULL", function () {
    let element = luri.construct(null);

    assert.equal(element.nodeName, "DIV");
    assert.equal(element.innerHTML, "");
  });

  it("From empty html", function () {
    assert.equal(luri.construct({
      html: null
    }).children.length, 0);
  });

  it("Reconstruct non-constructed component", function () {
    assert.throws(function () {
      let component = new MyComponent();
      component.reconstruct();
    }, "Can not reconstruct");
  });

  it("Style", function () {
    let test = function (div) {
      assert.equal(div.style.color, "black");
      assert.equal(div.style.fontSize, "16px");
    }

    test(luri.construct({
      style: {
        color: "black",
        "font-size": "16px"
      }
    }));

    test(luri.construct({
      style: "color: black; font-size: 16px"
    }));
  });

  it("Data", function () {
    let div = luri.construct({
      data: {
        weight: "100kg"
      }
    });

    assert.equal(div.dataset.weight, "100kg");

    div = luri.construct({
      data: "105kg"
    });

    assert.equal(div.getAttribute("data"), "105kg");
  });
});

describe("Helpers", function () {

  it("From string", function () {
    assert.deepEqual(luri.SPAN("test"), {
      node: "SPAN",
      html: "test"
    });
  });

  it("From integer", function () {
    assert.deepEqual(luri.SPAN(5), {
      node: "SPAN",
      html: 5
    });
  });

  it("From object", function () {
    assert.deepEqual(luri.SPAN({
      class: "test"
    }), {
      node: "SPAN",
      class: "test"
    });
  });

  it("From array", function () {
    assert.deepEqual(luri.SPAN(["dgd", "brat"]), {
      node: "SPAN",
      html: ["dgd", "brat"]
    });
  });

  it("Nested", function () {
    assert.deepEqual(luri.SPAN(luri.SPAN("test")), {
      node: "SPAN",
      html: {
        node: "SPAN",
        html: "test"
      }
    });
  });

});

describe("Component", function () {

  it("Cut", function () {
    let component = new MyComponent();
    component.cutprop = 5;

    assert.equal(component.cut("cutprop"), 5);
    assert.equal(component.cutprop, undefined);
  });

  it("Props", function () {
    let component = new luri.Component();
    let definition = component.props();

    assert(typeof definition === "object" && Object.keys(definition).length === 0);
  });

  it("Ninja", function () {
    class CustomComponent extends luri.Component {
      ninja() {
        return true;
      }
    }

    let component = new luri.Component();
    let ninja = new CustomComponent();

    assert.equal(luri.construct(ninja).classList.contains(luri.class), false);
    assert.equal(luri.construct(component).classList.contains(luri.class), true);
  });

  it("Define Listeners", function () {
    class CustomComponent extends luri.Component {
      listeners() {
        return {
          listener: carrier => carrier.data = 5
        }
      }
    }

    let component = new CustomComponent();
  });
});

describe("Events", function () {

  it("Listeners", function () {
    let component = new MyComponent();
    let listeners = component.getEventListeners("test");

    assert.equal(listeners.length, 1, "Must have 1 listener");
    assert.equal(typeof listeners[0], "function", "Listener must be a function");

    let listener = listeners[0];
    component.off("test", listener);
    assert.equal(component.getEventListeners("test").length, 0, "Must not have listeners");

    // rebind listener
    component.on("test", listener);
  });

  it("Emission", function () {
    let data = [];
    let result = luri.emit("test", data);

    assert.equal(result.length, 1, "Result must be array with passed arguments");
    assert.strictEqual(result[0], data, "Passed and returned data must be the same");
  });

});

describe("DOM", function () {

  it("Append", function () {
    let component = new MyComponent();

    document.body.appendChild(component.construct());

    assert.equal(document.body.children.length, 1, "Body must have 1 child at this point");
    assert.equal(document.body.firstElementChild, component.ref, "Child must be our component's element");
  });

  it("Events", function () {
    // component already part of the document

    let [
      [mustBeTrue]
    ] = luri.emit("test", []);

    assert.strictEqual(mustBeTrue, true, "Component must push boolean value");
  });

  it("Dispatch", function () {
    // 1 component mounted already
    let newClass = "special-class";
    luri.emit("change", newClass);

    // 2 component
    let component = new MyComponent();
    document.body.appendChild(component.construct());

    // 3 component
    // test if luri is missing on a component element.
    let brokenComponent = new MyComponent();
    let brokenElement = brokenComponent.construct();
    document.body.appendChild(brokenElement);
    delete (brokenElement.luri);

    let [emitResult] = luri.emit("test", []);
    assert.equal(emitResult.length, 2, "2 components on the document must react to emit");

    let [dispatchResult] = luri.dispatchToClass(newClass, "test", []);
    assert.equal(dispatchResult.length, 1, "Only modified component should react to this dispatch");

    // remove broken component
    document.body.removeChild(brokenElement);
  });

  it("Reconstruct", function () {
    // first component was reconstructed in "change" event
    assert.equal(document.body.children.length, 2, "Must have 2 children at this point");
  });

  it("Mount", function () {
    assert(document.body.firstElementChild.luri.isMounted(), "Component should be mounted");
    assert.strictEqual(new MyComponent().isMounted(), false, "Component should not be mounted");
  });
});

describe("Other", function () {

  // This is only made to reach 100% coverage
  it("Export", function () {
    luri.export(false);
  });

  it("Override def event handler", function () {
    let first, second,
      runFirst = function () {
        first = true;
      },
      runSecond = function () {
        assert(first, "First function must be executed before second");
        second = true;
      },
      runThird = function () {
        assert(first && second, "First and second functions must have ran");
      };

    function test(def) {
      first = false;
      second = false;
      luri.overrideEventHandler(def, "onsubmit", runSecond);
      luri.overrideEventHandler(def, "onsubmit", runFirst, true);
      luri.overrideEventHandler(def, "onsubmit", runThird);

      if (def instanceof luri.Component) {
        def.ref.onsubmit();
      } else {
        def.onsubmit();
      }
    }

    test({
      node: "form"
    });
    test(new luri.Component());
  });
});