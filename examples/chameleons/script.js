class Chameleon extends luri.Component {

  constructor(bw) {
    super();

    this.bw = bw;

    this.autoChange();
  }

  autoChange() {
    try {
      this.changeColor();
    } catch (e) {

    } finally {
      setTimeout(this.autoChange.bind(this), Math.random() * 5000);
    }
  }

  changeColor() {
    if (this.ref) {
      var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
      this.ref.style.backgroundColor = color;
      this.ref.style.color = this.invertColor(color, this.bw);
    }
  }

  invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
      // http://stackoverflow.com/a/3943023/112731
      return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ?
        '#000000' :
        '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    function padZero(str, len) {
      len = len || 2;
      var zeros = new Array(len).join('0');
      return (zeros + str).slice(-len);
    }

    return "#" + padZero(r) + padZero(g) + padZero(b);
  }

  props() {
    return {
      class: "chameleon",
      node: "h2",
      html: "I'm a " + (this.bw ? "user friendly" : "wild") + " chameleon.",
      onclick: this.changeColor.bind(this)
    };
  }
}

document.body.appendChild(luri.construct({
  class: "chameleons",
  html: [
    new Chameleon(),
    new Chameleon(true)
  ]
}));
