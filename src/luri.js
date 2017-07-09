"use strict";

(function (root) {

  var special_props = ["node", "html", "ref"];

  var luri = {
    construct: function (input) {
      var props;

      if (typeof input === "string") {
        return document.createTextNode(input);
      } else if (input instanceof this.Component) {
        props = input.props();
        if (!props.ref) {
          props.ref = e => input.ref = e;
        }
      } else {
        props = input;
      }

      var element = document.createElement(props.node || "div");
      var html = props.html || [];
      var ref = props.ref;

      for (var i = 0, l = special_props.length; i < l; i++) {
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
        ref(element);
      }

      return element;
    },
    Component: class Component {
      
      constructor() {
        this.ref = null;
      }
    
      props() {
        return {};
      }
    }
  };

  ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"].forEach(function (tag) {
    luri[tag.toUpperCase()] = function (props) {
      if (typeof props === "string") {
        props = {node: tag, html: props};
      } else {
        props.node = tag;
      }
      
      return luri.construct(props);
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
