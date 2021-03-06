interface Map {
  [key: string]: any
}

type simpledefinition = null | string | number | Map | Component | Element;
type complexdefinition = simpledefinition | simpledefinition[];
type definition = complexdefinition | Promise<complexdefinition>;

interface LuriHTMLElement extends HTMLElement {
  luri: Component
}

export function construct(input: definition): HTMLElement | Text;

export function normalizeDefinition(def: definition): definition;

export function overrideEventHandler(def: definition, event: string, listener: (...params: any[]) => void, before?: boolean): definition;

export class Component {
  public ref: LuriHTMLElement;
  bind(element: LuriHTMLElement): void;
  ninja(): boolean;
  construct(): LuriHTMLElement;
  reconstruct(): LuriHTMLElement;
  cut(property: string): any;
  getEventListeners(event: string): ((...params: any[]) => void)[];
  on(event: string, listener: (...params: any[]) => void): void;
  off(event: string, listener: (...params: any[]) => void): void;
  removeEvenetListener(event: string, listener: () => void): void;
  isMounted(): boolean;
  props(): definition;
}

export function emit(event: string, ...data: any[]): any[];

export function dispatchToClass(className: string, event: string, ...data: any[]): any[];

export function dispatchTo(collection: HTMLElement[] | HTMLCollection | NodeList, event: string, ...data: any[]): any[];

export function promise(def: definition, promise: Promise<definition>): definition;

export function A(def: definition): definition;
export function ABBR(def: definition): definition;
export function ADDRESS(def: definition): definition;
export function AREA(def: definition): definition;
export function ARTICLE(def: definition): definition;
export function ASIDE(def: definition): definition;
export function AUDIO(def: definition): definition;
export function B(def: definition): definition;
export function BASE(def: definition): definition;
export function BDI(def: definition): definition;
export function BDO(def: definition): definition;
export function BLOCKQUOTE(def: definition): definition;
export function BODY(def: definition): definition;
export function BR(def: definition): definition;
export function BUTTON(def: definition): definition;
export function CANVAS(def: definition): definition;
export function CAPTION(def: definition): definition;
export function CITE(def: definition): definition;
export function CODE(def: definition): definition;
export function COL(def: definition): definition;
export function COLGROUP(def: definition): definition;
export function DATA(def: definition): definition;
export function DATALIST(def: definition): definition;
export function DD(def: definition): definition;
export function DEL(def: definition): definition;
export function DETAILS(def: definition): definition;
export function DFN(def: definition): definition;
export function DIALOG(def: definition): definition;
export function DIV(def: definition): definition;
export function DL(def: definition): definition;
export function DT(def: definition): definition;
export function EM(def: definition): definition;
export function EMBED(def: definition): definition;
export function FIELDSET(def: definition): definition;
export function FIGCAPTION(def: definition): definition;
export function FIGURE(def: definition): definition;
export function FOOTER(def: definition): definition;
export function FORM(def: definition): definition;
export function H1(def: definition): definition;
export function H2(def: definition): definition;
export function H3(def: definition): definition;
export function H4(def: definition): definition;
export function H5(def: definition): definition;
export function H6(def: definition): definition;
export function HEAD(def: definition): definition;
export function HEADER(def: definition): definition;
export function HGROUP(def: definition): definition;
export function HR(def: definition): definition;
export function HTML(def: definition): definition;
export function I(def: definition): definition;
export function IFRAME(def: definition): definition;
export function IMG(def: definition): definition;
export function INPUT(def: definition): definition;
export function INS(def: definition): definition;
export function KBD(def: definition): definition;
export function KEYGEN(def: definition): definition;
export function LABEL(def: definition): definition;
export function LEGEND(def: definition): definition;
export function LI(def: definition): definition;
export function LINK(def: definition): definition;
export function MAIN(def: definition): definition;
export function MAP(def: definition): definition;
export function MARK(def: definition): definition;
export function MATH(def: definition): definition;
export function MENU(def: definition): definition;
export function MENUITEM(def: definition): definition;
export function META(def: definition): definition;
export function METER(def: definition): definition;
export function NAV(def: definition): definition;
export function NOSCRIPT(def: definition): definition;
export function OBJECT(def: definition): definition;
export function OL(def: definition): definition;
export function OPTGROUP(def: definition): definition;
export function OPTION(def: definition): definition;
export function OUTPUT(def: definition): definition;
export function P(def: definition): definition;
export function PARAM(def: definition): definition;
export function PICTURE(def: definition): definition;
export function PRE(def: definition): definition;
export function PROGRESS(def: definition): definition;
export function Q(def: definition): definition;
export function RB(def: definition): definition;
export function RP(def: definition): definition;
export function RT(def: definition): definition;
export function RTC(def: definition): definition;
export function RUBY(def: definition): definition;
export function S(def: definition): definition;
export function SAMP(def: definition): definition;
export function SCRIPT(def: definition): definition;
export function SECTION(def: definition): definition;
export function SELECT(def: definition): definition;
export function SLOT(def: definition): definition;
export function SMALL(def: definition): definition;
export function SOURCE(def: definition): definition;
export function SPAN(def: definition): definition;
export function STRONG(def: definition): definition;
export function STYLE(def: definition): definition;
export function SUB(def: definition): definition;
export function SUMMARY(def: definition): definition;
export function SUP(def: definition): definition;
export function SVG(def: definition): definition;
export function TABLE(def: definition): definition;
export function TBODY(def: definition): definition;
export function TD(def: definition): definition;
export function TEMPLATE(def: definition): definition;
export function TEXTAREA(def: definition): definition;
export function TFOOT(def: definition): definition;
export function TH(def: definition): definition;
export function THEAD(def: definition): definition;
export function TIME(def: definition): definition;
export function TITLE(def: definition): definition;
export function TR(def: definition): definition;
export function TRACK(def: definition): definition;
export function U(def: definition): definition;
export function UL(def: definition): definition;
export function VAR(def: definition): definition;
export function VIDEO(def: definition): definition;
export function WBR(def: definition): definition;
