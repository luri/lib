var { H1, FORM, BUTTON, I, INPUT, SELECT, OPTION, TABLE, TR, TD, TH, THEAD, TBODY, TFOOT, SPAN } = luri;

class RecordCreator extends luri.Component {

  addRecord(event) {
    event.preventDefault();

    var form = event.target;

    luri.emit("add-record", {
      desc: form.elements.desc.value,
      amount: form.elements.amount.value,
      type: form.elements.type.value
    });

    form.reset();
  }

  props() {
    return FORM({
      class: "d-flex mb-3",
      onsubmit: this.addRecord,
      html: [{
          class: "input-group",
          html: [
              INPUT({ class: "form-control w-50", name: "desc", placeholder: "Description" }),
              INPUT({ class: "form-control w-25", name: "amount", type: "number", placeholder: "Amount", min: 0, step: 0.01 }),
              SELECT({
              name: "type",
              class: "form-control w-25",
              html: [
                  OPTION({ value: 0, html: "Income" }),
                  OPTION({ value: 1, html: "Expense" })
                ]
            })
            ]
          },
          BUTTON({
          type: "submit",
          class: "btn btn-primary rounded-0",
          html: I({ class: "fa fa-plus" })
        })
      ]
    });
  }
}

class RecordList extends luri.Component {

  constructor() {
    super();

    this.recordIndex = 1;

    this.on("add-record", this.addRecord);
    this.on("ledger-changed", this.calculateTotal);
  }

  addRecord(record) {
    var { desc, amount, type } = record;

    if (!desc || !amount) {
      return alert("Please specify description and amount.");
    }

    if (type && type * 1) {
      amount *= -1;
    }

    var index = this.recordIndex++;

    this.body.appendChild(luri.construct(TR({
      id: "ledger-record-" + index,
      html: [
        TD(index),
        TD(new Date().toDateString()),
        TD({ html: SPAN({ html: desc, onclick: this.edit }) }),
        TD({ html: new Currency(amount * 1, true) }),
        TD({
          class: "text-center",
          html: I({
            class: "fa fa-trash text-danger"
          }),
          onclick: this.removeRecord.bind(this, index)
        })
      ]
    })));

    luri.emit("ledger-changed");
  }

  removeRecord(index) {
    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    var tr = document.getElementById("ledger-record-" + index);

    this.body.removeChild(tr);

    luri.emit("ledger-changed");
  }

  calculateTotal() {
    this.total.innerHTML = "";
    this.total.appendChild(luri.construct(new Currency([].reduce.call(this.body.children, (sum, tr) => {
      return sum + tr.children[3].firstElementChild.innerHTML * 1;
    }, 0))));
  }

  edit(event) {
    new Editor(event.target).replace();
  }

  props() {
    return TABLE({
      class: "table table-bordered text-left",
      html: [
        THEAD(TR([
          TH("#"),
          TH("Date"),
          TH("Description"),
          TH("Amount"),
          TH()
        ])),
        TBODY({ ref: e => this.body = e }),
        TFOOT([
          TR([
            TH({ colspan: 3, html: "TOTAL" }),
            TH({ colspan: 2, ref: e => this.total = e, html: new Currency(0) })
          ])
        ])
      ]
    });
  }
}

class Currency extends luri.Component {

  constructor(value, editable) {
    super();
    this.value = value;
    this.editable = editable;
  }

  color() {
    if (this.ref.innerHTML > 0) {
      this.ref.classList.remove("text-danger");
      this.ref.classList.add("text-success");
    } else {
      this.ref.classList.add("text-danger");
      this.ref.classList.remove("text-success");
    }
  }

  onMount() {
    super.onMount();

    this.color();
    this.ref.innerHTML = (this.ref.innerHTML * 1).toFixed(2);
  }

  edit() {
    if (this.luri.editable) {
      new Editor(this).replace();
    }
  }

  props() {
    return SPAN({
      html: this.cut("value"),
      onclick: this.edit
    });
  }
}

class Editor extends luri.Component {

  constructor(element) {
    super();

    this.element = element;
  }

  save() {
    this.luri.element.innerHTML = this.value;

    this.parentNode.replaceChild(this.luri.element, this);

    luri.emit("ledger-changed");
  }

  saveOnKeypress(event) {
    if (event.which === 13) {
      this.luri.save.call(this);
    }
  }

  replace() {
    this.element.parentNode.replaceChild(this.construct(), this.element);
    this.ref.focus();
  }

  props() {
    return INPUT({
      class: "form-control",
      value: this.element.innerHTML,
      onblur: this.save,
      onkeypress: this.saveOnKeypress
    })
  }
}


document.body.appendChild(luri.construct({
  class: "container-fluid text-center",
  html: [
    H1({ class: "m-5 mb-2", html: "Simple Ledger" }),
    BUTTON({
      html: "Load dummy records",
      class: "btn btn-secondary mb-5",
      onclick: function() {
        fetch("dummy.json").then(response => {
          return response.json();
        }).then(json => {
          json.forEach(luri.emit.bind(null, "add-record"));
        });
      }
    }),
    new RecordCreator,
    new RecordList
  ]
}));
