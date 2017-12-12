"use strict";

(function(root) {

  var luri = {
    construct: (function() {
      var special_props = ["node", "html", "ref"];

      return function(input) {
        var props;

        if (typeof input === "string" || typeof input === "number") {
          return document.createTextNode(input);
        } else if (input instanceof this.Component) {
          if (input.ref) {
            return input.ref;
          }
          props = this.normalizeDefinition(input.props());
          props.ref = input.bind;
        } else {
          props = this.normalizeDefinition(input);
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

        if (Array.isArray(html)) {
          for (var i = 0, l = html.length; i < l; i++) {
            element.appendChild(this.construct(html[i]));
          }
        } else {
          element.appendChild(this.construct(html));
        }

        if (ref) {
          ref.call(input, element);
        }

        return element;
      }
    })(),
    normalizeDefinition(def) {
      return typeof def === "object" && !Array.isArray(def) ? def : { html: def };
    },
    overrideEventHandler(def, event, listener, before = false) {
      def = luri.normalizeDefinition(def);

      var target = def instanceof luri.Component ? def.construct() : def;

      if (target[event]) {
        let current = target[event];

        target[event] = function(e) {
          if (before) {
            listener.call(this, e);
            current.call(this, e);
          } else {
            current.call(this, e);
            listener.call(this, e);
          }
        }
      } else {
        target[event] = listener;
      }

      return def;
    },
    Component: class Component {

      constructor() {
        this._li = {};
        this.ref = null;
      }

      bind(element) {
        this.ref = element;
        element.luri = this;

        if (!this.ninja()) {
          element.classList.add(luri.class);
        }
      }

      ninja() {
        return false;
      }

      construct() {
        return luri.construct(this);
      }

      reconstruct() {
        if (!this.ref) {
          throw "Can not reconstruct a component that has not been constructed yet.";
        }

        var old = this.ref;

        // construct() will return this.ref if it is defined, so assign null first
        this.ref = null;

        this.bind(this.construct());

        if (old.parentNode) {
          old.parentNode.replaceChild(this.ref, old);
        }

        return old;
      }

      cut(property) {
        var value = this[property];
        delete(this[property]);
        return value;
      }

      getEventListeners(event) {
        return this._li[event] || [];
      }

      on(event, listener, priority = 10000) {
        let listeners = this.getEventListeners(event)
        listeners.push(listener);

        this._li[event] = listeners;
      }

      off(event, listener) {
        return this.removeEventListener(event, listener);
      }

      removeEventListener(event, listener) {
        this._li[event] = this.getEventListeners(event).filter(l => l !== listener);
      }

      isMounted() {
        return document.documentElement.contains(this.ref);
      }

      props() {
        return {};
      }
    },
    class: "luri-" + Math.random().toString(36).substring(2, 6),
    emit: function(event, ...data) {
      return luri.dispatchTo(document.getElementsByClassName(luri.class), event, ...data);
    },
    dispatchToClass(className, event, ...data) {
      return luri.dispatchTo(document.getElementsByClassName(className), event, ...data);
    },
    dispatchTo(collection, event, ...data) {
      var l = collection.length;
      while (l--) {
        let component = collection[l].luri;

        if (component) {
          component.getEventListeners(event).forEach(listener => listener.call(component, ...data));
        }
      }

      return data;
    },
    export: function(asModule = true) {
      if (asModule && typeof module !== 'undefined' && module.exports) {
        module.exports = luri;
      } else {
        root.luri = luri;
      }
    }
  };

  (function() {
    var shorthand = function(props) {
      props = luri.normalizeDefinition(props);
      if (props.node) {
        props = { html: props };
      }
      props.node = this;

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

  luri.export();

})(this);
