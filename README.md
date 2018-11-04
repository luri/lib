# luri

A simple JavaScript library for creating HTML UI, inspired by ReactJS and created for fun, and science, of course.

[![Build](https://img.shields.io/travis/luri/lib.svg)](https://travis-ci.org/luri/lib)
[![Coverage](https://coveralls.io/repos/github/luri/lib/badge.svg)](https://coveralls.io/github/luri/lib)
[![Version](https://img.shields.io/npm/v/luri.svg)](https://www.npmjs.com/package/luri)
[![Dependencies](https://img.shields.io/david/luri/lib.svg)](https://david-dm.org/luri/lib)

---

## Ideology

**General**  
The idea of a UI rendering library is that a client should be responsible for rendering its own UI and the server should not be aware of the presentation logic, transmitting only essential data.

**luri**  
The main goal behind `luri` is *simplicity*. It is designed in a way that requires as little learning as possible. If you're familiar with JavaScript and HTML it should literally take you no more than 10 minutes before you can start building. Second but equally as important is the simplicity of the source code. It is ~1.7KB minified and gzipped.

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

A slightly more complex example using a component can be found [here](https://jsfiddle.net/7a8c8tk0/12/). Browse `./examples` for more demos. There have been some changes since those examples were added, perhaps they can get updated or may add more if there is interest, but the principle is the same.

You can check out the [spa-quickstart](https://github.com/luri/spa-quickstart) repository that will get you started with building a single page web app in no time.

## Utility

You will find a transpiler in `./utils/transpiler/index.html` that you can use to convert an HTML string into a definition.
You can also access it [here](https://luri.github.io/lib/utils/transpiler/), thanks to github pages.
