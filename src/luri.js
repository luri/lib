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

        if (typeof input === "string") {
          return document.createTextNode(input);
        } else if (Array.isArray(input)) {
          props = { html: input };
        } else if (input instanceof this.Component) {
          props = input.props();
          props.ref = default_ref;
        } else {
          props = input;
        }

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
        this.ref = null;
      }

      construct() {
        return luri.construct(this);
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
        if (this.getEventListeners(event).length === 0) {
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
        for (var event in this._li) {
          luri.registerListener(event, this);
        }
      }

      onUnmount() {
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

    luri.get = getListeners;

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

  new MutationObserver(function(mutations) {
    var ml = mutations.length;
    while (ml--) {
      var mutation = mutations[ml];
      var nodes = mutation.removedNodes.length;
      while (nodes--) {
        try {
          mutation.removedNodes[nodes].luri.onUnmount();
        } catch (e) {

        }
      }
      var nodes = mutation.addedNodes.length;
      while (nodes--) {
        try {
          mutation.addedNodes[nodes].luri.onMount();
        } catch (e) {

        }
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true });

  ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"].forEach(function(tag) {
    luri[tag.toUpperCase()] = function(props) {
      if (typeof props === "string" || Array.isArray(props)) {
        props = { node: tag, html: props };
      } else {
        props.node = tag;
      }

      return props;
    };
  });

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = luri;
    }
    exports.mymodule = luri;
  } else {
    root.luri = luri;
  }

})(this);
