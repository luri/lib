"use strict";

(function(root) {

  var luri = {
    construct: (function() {
      var special_props = ["node", "html", "ref"];
      var default_ref = function(e) {
        this.ref = e;
        e.luri = this;
      };

      return function(input) {
        var props;

        if (typeof input === "string" || typeof input === "number") {
          return document.createTextNode(input);
        } else if (Array.isArray(input)) {
          props = { html: input };
        } else if (input instanceof this.Component) {
          if (input.ref) {
            return input.ref;
          }
          props = input.props();
          props.ref = default_ref;
        } else {
          props = input;
        }

        props = Object.assign({}, props);

        var element = document.createElement(props.node || "div");
        var html = props.html || [];
        var ref = props.ref;

        var i = special_props.length;
        while (i--) {
          delete(props[special_props[i]]);
        }

        for (var prop in props) {
          var value = props[prop];

          if (typeof value === "function" && prop.indexOf("on") === 0) {
            element[prop] = value;
          } else {
            element.setAttribute(prop, value);
          }
        }

        if (html) {
          if (Array.isArray(html)) {
            for (var i = 0, l = html.length; i < l; i++) {
              element.appendChild(this.construct(html[i]));
            }
          } else {
            element.appendChild(this.construct(html));
          }
        }

        if (ref) {
          ref.call(input, element);
        }

        return element;
      }
    })(),
    ComponentIndex: (function() {
      var componentIndex = 0;

      return function() {
        return ++componentIndex;
      }
    })(),
    Component: class Component {

      constructor() {
        this._ci = luri.ComponentIndex();
        this._li = {};
        this._m = false;
        this.ref = null;
      }

      construct() {
        return luri.construct(this);
      }

      reconstruct() {
        if (!this.ref) {
          throw "Can not reconstruct a component that has not been constructed yet.";
        }

        var element = this.construct();

        if (this.ref.parentNode) {
          this.ref.parentNode.replaceChild(element, this.ref);
        }

        this.ref = element;
      }

      cut(property) {
        var value = this[property];
        delete(this[property]);
        return value;
      }

      getComponentIndex() {
        return this._ci;
      }

      getEventListeners(event) {
        if (!this._li[event]) {
          this._li[event] = [];
        }

        return this._li[event];
      }

      on(event, listener) {
        if (this._m && this.getEventListeners(event).length === 0) {
          luri.registerListener(event, this);
        }

        this.getEventListeners(event).push(listener);
      }

      off(event, listener) {
        return this.removeEventListener(event, listener);
      }

      removeEventListener(event, listener) {
        this._li[event] = this.getEventListeners(event).filter(l => l !== listener);

        if (this.getEventListeners(event).length === 0) {
          luri.unregisterListener(event, this);
        }
      }

      onMount() {
        if (this._m === true) {
          return;
        }

        this._m = true;

        for (var event in this._li) {
          luri.registerListener(event, this);
        }
      }

      onUnmount() {
        if (this._m === false) {
          return;
        }

        this._m = false;

        for (var event in this._li) {
          luri.unregisterListener(event, this);
        }
      }

      props() {
        return {};
      }
    }
  };

  (function() {
    var listeners = {};

    function getListeners(event) {
      if (!listeners[event]) {
        listeners[event] = {};
      }

      return listeners[event];
    };

    luri.registerListener = function(event, component) {
      getListeners(event)[component.getComponentIndex()] = component;
    };

    luri.unregisterListener = function(event, component) {
      delete(getListeners(event)[component.getComponentIndex()]);
    };

    luri.emit = function(event, ...data) {

      var components = getListeners(event);

      for (var i in components) {
        components[i].getEventListeners(event).forEach(listener => listener.call(components[i], ...data));
      }

      return data;
    };
  })();

  (function() {
    var run = function(element, event) {
      if (element.luri) {
        element.luri["on" + event]();
      }

      if (element.children) {
        var i = element.children.length;
        while (i--) {
          run(element.children[i], event);
        }
      }
    }

    new MutationObserver(function(mutations) {
      var ml = mutations.length;
      while (ml--) {
        var mutation = mutations[ml];
        var nodes = mutation.removedNodes.length;
        while (nodes--) {
          try {
            run(mutation.removedNodes[nodes], "Unmount");
          } catch (e) {

          }
        }
        var nodes = mutation.addedNodes.length;
        while (nodes--) {
          try {
            run(mutation.addedNodes[nodes], "Mount");
          } catch (e) {

          }
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  })();

  (function() {
    var shorthand = function(props) {
      if (!props || typeof props === "number" || typeof props === "string" || Array.isArray(props) || props.node) {
        props = { node: this, html: props };
      } else {
        props.node = this;
      }

      return props;
    };

    ["A", "ABBR", "ADDRESS", "AREA", "ARTICLE", "ASIDE", "AUDIO", "B", "BASE", "BDI", "BDO",
    "BLOCKQUOTE", "BODY", "BR", "BUTTON", "CANVAS", "CAPTION", "CITE", "CODE", "COL",
    "COLGROUP", "DATA", "DATALIST", "DD", "DEL", "DETAILS", "DFN", "DIALOG", "DIV", "DL",
    "DT", "EM", "EMBED", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2",
    "H3", "H4", "H5", "H6", "HEAD", "HEADER", "HGROUP", "HR", "HTML", "I", "IFRAME", "IMG",
    "INPUT", "INS", "KBD", "KEYGEN", "LABEL", "LEGEND", "LI", "LINK", "MAIN", "MAP", "MARK",
    "MATH", "MENU", "MENUITEM", "META", "METER", "NAV", "NOSCRIPT", "OBJECT", "OL",
    "OPTGROUP", "OPTION", "OUTPUT", "P", "PARAM", "PICTURE", "PRE", "PROGRESS", "Q",
    "RB", "RP", "RT", "RTC", "RUBY", "S", "SAMP", "SCRIPT", "SECTION", "SELECT", "SLOT",
    "SMALL", "SOURCE", "SPAN", "STRONG", "STYLE", "SUB", "SUMMARY", "SUP", "SVG", "TABLE",
    "TBODY", "TD", "TEMPLATE", "TEXTAREA", "TFOOT", "TH", "THEAD", "TIME", "TITLE", "TR",
    "TRACK", "U", "UL", "VAR", "VIDEO", "WBR"].forEach(tag => luri[tag] = shorthand.bind(tag));
  })();

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = luri;
    }
    exports.mymodule = luri;
  } else {
    root.luri = luri;
  }

})(this);
