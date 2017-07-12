# luri

A simple JavaScript library for creating HTML UI, inspired by ReactJS and created for fun, and science, of course.

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
