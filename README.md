# luri

A simple JavaScript library for creating HTML UI, inspired by ReactJS and created for fun, and science, of course.

[![Build](https://img.shields.io/travis/luri/lib.svg)](https://travis-ci.org/luri/lib)
[![Coverage](https://coveralls.io/repos/github/luri/lib/badge.svg)](https://coveralls.io/github/luri/lib)
[![Version](https://img.shields.io/npm/v/luri.svg)](https://www.npmjs.com/package/luri)
[![Dependencies](https://img.shields.io/david/luri/lib.svg)](https://david-dm.org/luri/lib)

---

## Ideology

The idea of a UI rendering library is that a client should be responsible for rendering its own UI and the server should not be aware of the presentation logic, transmitting only essential data.

The goal behind `luri` is to make UI rendering as simple and *lightweight* as possible, and still maintain a good level of flexibility. Additionally it aims to use the DOM as its primary data management tool.

## Concepts

There are a few simple concepts you need to understand before you can use `luri`.

* **Definitions**  
A definition is a piece of information that can be used by the library to construct an HTML element. The most common data type for definitions is an object which contains the HTML element's attributes as properties, however other valid definitions are strings, numbers, null and Components, which are also a concept, explained below. Arrays are also considered a valid definition, however they represent a list of definitions and do not provide information for a single HTML element.

* **Components**  
A component is a class that inherits from `luri.Component`. Every component must implement a `props()` method, which must return a *definition* that will tell `luri` how to construct that particular component. Every component keeps a reference to its constructed HTML element, as well as a reference to the component is kept in the HTML element. Components are useful for code separation, but their real strength is that they can listen globally to emitted events and *react* to each accordingly.

* **Events**  
An event in the context of the library is nothing different than a regular event,  except it gets broadcasted globally (unless explicitly declared elsewise) in the document to the mounted components.

## Helpers

There are helper functions for every standard HTML tag that modify a definition, by adding the `node` property automatically. Helper functions can be accessed via `luri.<ANY_HTML_TAG_IN_UPPERCASE>(<Definition>)`.

## Example usage

    // Using object definitions
    let element = luri.construct([
      {
        node: "h1",
        html: "It worked!"
      }, {
        node: "button",
        html: "Click me!",
        onclick: event => alert("Woohoo!")
      }
    ]);

    // Or using helpers
    let { H1, BUTTON } = luri;

    let element = luri.construct([
      H1("It worked!"),
      BUTTON({ html: "Click me!", onclick: event => alert("Woohoo!") })
    ])

    // Then
    document.body.appendChild(element);

A slightly more complex example using a component can be found [here](https://jsfiddle.net/7a8c8tk0/1/). Browse `./examples` for more demos.

You can also check out [manix.info](https://manix.info) where you will find a fully functional single page app built on top of luri. The source code is also on [github](https://github.com/manix/portfolio).

## Utility

You will find a transpiler in `./utils/transpiler/index.html` that you can use to convert an HTML structure into a definition. The only requirement is that the HTML string you provide must have only one root element, other elements will simply be ignored.

You can access the transpiler [here](https://luri.github.io/lib/utils/transpiler/), thanks to github pages.
