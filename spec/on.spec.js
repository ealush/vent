require('../lib/vent.min.js');
const faker = require("faker");

const selectors = [".some-class", "#some-list", "li:nth-child(2)"];

describe("vent.on", () => {
  let rootElement, v, handler, element;

  beforeEach(() => {
    rootElement = document.createElement("div");
    rootElement.innerHTML = `
        <div class="some-class">
            <ul id="some-list">
                <li class="child1"><span>item 1</span></li>
                <li class="child2"><span>item 2</span></li>
            </ul>
            <a href="#!">click me!</a>
        </div>
        `;
    document.body.appendChild(rootElement);
    handler = jest.fn();
  });

  afterEach(() => {
    rootElement.remove();
  });

  it("Should return current instance", () => {
    const v = vent("li");
    expect(v.on("click", jest.fn)).toBe(v);
  });

  describe("call addEventListener", () => {
    it("Should call addEventListener on every matched selector", () => {
      const eventName = faker.random.word();
      const nodes = vent("li");
      nodes.each(node => (node.addEventListener = jest.fn()));
      vent("li").on(eventName, jest.fn());
      nodes.each(node => {
        expect(node.addEventListener).toHaveBeenCalledWith(
          eventName,
          expect.any(Function)
        );
        node.addEventListener.mockRestore();
      });
    });

    it("Should call passed handler each time the event is fired", () => {
      v = vent("li").on("click", handler);

      v.each(e => e.click());
      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe("Multiple events", () => {
    it("Should accept space delimited events", () => {
      vent("a")
        .on("click focus", handler)
        .each(e => {
          e.click();
          e.focus();
        });
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it("Should prevent duplication when registering events", () => {
      vent("a")
        .on("click click focus", handler)
        .each(e => {
          e.click();
          e.focus();
        });
      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe("Event delegation", () => {
    it("Should allow delegation via second argument", () => {
      vent("ul").on("click", "li:first-child", handler);
      vent("li")
        .add("ul")
        .each(e => {
          e.click();
        });
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].target).toBe(
        document.querySelector("li:first-child")
      );
    });

    it("Should apply for a nested child element", () => {
      element = document.querySelector("li:first-child span");
      vent("ul").on("click", "li:first-child", handler);
      vent("li span").add("ul");
      element.click();
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].target).toBe(element);
    });
  });
});
