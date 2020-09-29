# luri

A simple JavaScript library for creating HTML UI, inspired by ReactJS and created for fun, and science, of course.

[![Build](https://img.shields.io/travis/luri/lib.svg)](https://travis-ci.org/luri/lib)
[![Coverage](https://coveralls.io/repos/github/luri/lib/badge.svg)](https://coveralls.io/github/luri/lib)
[![Version](https://img.shields.io/npm/v/luri.svg)](https://www.npmjs.com/package/luri)
[![Dependencies](https://img.shields.io/david/luri/lib.svg)](https://david-dm.org/luri/lib)

---

## Quick links

1. [Ideology](#Ideology)
2. [Concepts](#Concepts)
3. [API](#API)
4. [Helpers](#Helpers)
5. [Examples](#Examples)
6. [Utility](#Utility)
7. [Made With](#Made-With)

---

## Ideology

**General**  
The idea of a UI rendering library is that a client should be responsible for rendering its own UI and the server should not be aware of the presentation logic, transmitting only essential data.

**luri**  
The main goal behind `luri` is *simplicity*. It is designed in a way that requires as little learning as possible. If you're familiar with JavaScript and HTML it should literally take you no more than 10 minutes before you can start building. Second but equally as important is the simplicity of the source code. It is ~1.7KB minified and gzipped.

## Concepts

There are a few simple concepts you need to understand before you can use `luri`.

* **Definitions**  
A definition is a piece of information that can be used by the library to construct an HTML element. The most common data type for definitions is an object which contains the HTML element's attributes as properties, however other valid definitions are strings, numbers, null, HTMLElements, Promises and Components, which are another concept, explained below. Arrays are also considered a valid definition, however they represent a list of definitions and do not provide information for a single HTML element, so use with caution.

* **Components**  
A component is a class that inherits from `luri.Component`. Every component must implement a `props()` method, which must return a *definition* that will tell `luri` how to construct that particular component. Once constructed, there is a bond created between the Component and the HTMLElement. Components are useful for code separation. They can also listen globally to emitted events and *react* to each accordingly.

* **Events**  
An event in the context of the library is nothing different than a regular event,  except it gets broadcasted globally (unless explicitly declared otherwise) in the document to the mounted components.

## API

- `luri.construct`: constructs an HTMLElement or Text node from the provided input definition.
    ```
    luri.construct(definition: definition): HTMLElement | Text
    ```
- `luri.emit`: emits an event to all *currently attached to the document **Components***
    ```
    luri.emit (event: string, ...data: any[]): data: any[]
    ```
- `luri.dispatchToClass`: emits an event to all *currently attached to the document **Components*** matching `className`
    ```
    luri.dispatchToClass(className: string, event: string, ...data: any[]): data: any[]
    ```
- `luri.dispatchTo`: emits an event to a collection of HTMLElement nodes that reference **Components**
    ```
    luri.dispatchTo(collection: HTMLCollection | NodeList, event: string, ...data: any[]): data: any[]
    ```
- `luri.promise`: allows for a custom placeholder element until `promise` is resolved
    ```
    luri.promise(def: definition, promise: Promise): def: definition
    ```

## Helpers

There are helper functions for every standard HTML tag that modify a definition, by adding the `node` property automatically. Helper functions can be accessed via `luri.<ANY_HTML_TAG_IN_UPPERCASE>(<Definition>)`.

## Examples

In the examples below `#text` means the output is a `Text` node and html markup represents `HTMLElement` instances, output is never a string.

- Simplest usage - [live](https://jsfiddle.net/mvkuL5yz/1/)

      luri.construct("Hi");
  > #text "Hi"

- Creating an element - [live](https://jsfiddle.net/mvkuL5yz/2/)

      luri.construct({
       node: "span"
      });
    
  > \<span>\</span>

- With attributes and content - [live](https://jsfiddle.net/mvkuL5yz/3/)

      luri.construct({
        node: "h1",
        class: "title",
        html: "Hello"
      });
  > \<h1 class="title">Hello\</h1>

- Nesting - [live](https://jsfiddle.net/mvkuL5yz/4/)

      luri.construct({
        node: "p",
        html: {
          node: "img",
          src: "..."
        }
      })
  > \<p>\<img src="...">\</p>

- With multiple children - [live](https://jsfiddle.net/mvkuL5yz/5/)

      luri.construct({
        node: "p",
        html: [
          "Hey",
          {
            node: "img",
            src: "..."
          }
        ]
      })
  > \<p>Hey\<img src="...">\</p>

- Event listeners - [live](https://jsfiddle.net/mvkuL5yz/6/)

      luri.construct({
        node: "button",
        onclick() { 
          alert("Hello") 
        }
      })
  > \<button>\</button>

  Event listeners are assigned to the `on*` properties of `HTMLElement` instances so are not visible in the markup.

- Promises - [live](https://jsfiddle.net/g7v2y061/)

      luri.construct([
        "The time is: ",
        fetch("https://worldtimeapi.org/api/timezone/Europe/London")
          .then(response => response.json())
          .then(time => ({
            node: "strong",
            html: time.datetime
          })).catch(() => "Error fetching time")
      ])
  > \<div>The time is: \<div>\</div>\</div>
  
  By default, luri places an empty `div` as a placeholder for the Promise result. As soon as the promise gets resolved, the DOM changes:

  > \<div>The time is: \<strong>2020-09-01T08:00:00.000000+01:00\</strong>\</div>

  You can use `luri.promise` if you need a custom placeholder.

- Components
  
  A slightly more complex example using a component can be found [here](https://jsfiddle.net/mvkuL5yz/). 

You can browse `./examples` for more demos but beware. They were added a long time ago, eventually they will get updated if there is interest in the library, but the working principle is the same.

You can check out the [spa-quickstart](https://github.com/luri/spa-quickstart) repository that will get you started with building a single page web app in no time.

## Utility

You will find a transpiler in `./utils/transpiler/index.html` that you can use to convert an HTML string into a definition.
You can also access it [here](https://luri.github.io/lib/utils/transpiler/), thanks to github pages.

## Made With

Projects made using `luri`.

[<img src="https://gigacharger.net/wp-content/uploads/2018/08/logo-footer.png" width="128px">](https://play.google.com/store/apps/details?id=net.gigacharger.app)
[<img src="https://servy.manix.info/app/images/logo/logo.png" width="128px">](https://servy.manix.info/app/index.html)



