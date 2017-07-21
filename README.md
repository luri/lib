# luri

A simple JavaScript library for creating HTML UI, inspired by ReactJS and created for fun, and science, of course.

---

[![travis](https://img.shields.io/travis/manix/luri.svg)](https://github.com/manix/luri)
[![npm](https://img.shields.io/npm/v/luri.svg)](https://www.npmjs.com/package/luri)
[![dep](https://img.shields.io/david/manix/luri.svg)](https://david-dm.org/manix/luri)
---

## How to use

`npm install luri`

Include it in your document and then

    var element = luri.construct({
      html: [
        {
          node: "h1",
          html: "It worked!"
        }, {
          node: "button",
          html: "Click me!",
          onclick: event => alert("Woohoo!")
        }
      ]
    });

    document.body.appendChild(element);

Browse `./examples` for demos.
