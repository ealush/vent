require('../lib/vent.min.js');

describe("Vent: off", () => {
  let rootElement, remove, handler, v;

  beforeEach(() => {
    rootElement = document.createElement("div");
    rootElement.innerHTML = `
            <div class="some-class">
                <ul id="some-list">
                    <li>item:1</li>
                    <li>item:2</li>
                </ul>
                <a href="#!">click me!</a>
            </div>
        `;
    document.body.appendChild(rootElement);
    remove = jest.fn();
    handler = jest.fn();
  });

  afterEach(() => {
    rootElement.remove();
  });

  it("Should return current instance", () => {
    v = vent("li");
    expect(v.off("click")).toBe(v);
  });

  describe("call removeEventListener", () => {
    describe("events were added using `on`", () => {
      it("Should call removeEventListener for every matched element", () => {
        remove = jest.fn();
        handler = jest.fn();
        vent("li");
        v.on("click", handler);
        v.each(node => (node.removeEventListener = remove));
        v.off("click");
        expect(remove).toHaveBeenCalledTimes(2);
      });

      test("Event handler is not called when triggered", () => {
        remove = jest.fn();
        handler = jest.fn();
        vent("li")
          .on("click", handler)
          .off("click")
          .trigger("click");
        expect(handler).toHaveBeenCalledTimes(0);
      });
    });

    describe("events were not added using `on`", () => {
      it("Should exit without calling addEventListener", () => {
        remove = jest.fn();
        handler = jest.fn();
        vent("li");
        v.each(node => (node.removeEventListener = remove));
        v.off("click");
        expect(remove).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("No events", () => {
    it("Should call removeEventListener for all registered events", () => {
      remove = jest.fn();
      handler = jest.fn(console.log);
      vent("a")
        .on("click mouseenter", handler)
        .each(node => (node.removeEventListener = remove))
        .off();
      expect(remove).toHaveBeenCalledTimes(2);
    });
  });

  describe("Multiple events", () => {
    it("Should accept space delimited events", () => {
      remove = jest.fn();
      vent("a")
        .on("click mouseenter", jest.fn())
        .each(node => (node.removeEventListener = remove))
        .off("click mouseenter");
      expect(remove).toHaveBeenCalledTimes(2);
    });

    it("Should prevent duplication when removing events", () => {
      remove = jest.fn();
      vent("a")
        .on("click click", jest.fn)
        .each(node => (node.removeEventListener = remove))
        .off("click click");
      expect(remove).toHaveBeenCalledTimes(1);
    });
  });

  describe("Off with event name", () => {
    it("Should only remove the passed event names", () => {
      v = vent("ul")
        .on("mouseenter mouseleave", handler)
        .trigger("mouseenter mouseleave");
      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler.mock.calls[0][0].type).toBe("mouseenter");
      expect(handler.mock.calls[1][0].type).toBe("mouseleave");
      handler = jest.fn();
      v = vent("ul").on("mouseenter mouseleave", handler);
      v.off("mouseleave").trigger("mouseenter mouseleave");
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].type).toBe("mouseenter");
    });
  });

  describe("Off with handler", () => {
    it("Should only remove events with specified handler", () => {
      const handler1 = jest.fn();
      v = vent("ul")
        .on("click", handler)
        .on("click", handler1)
        .each(el => el.click());

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler1).toHaveBeenCalledTimes(1);

      v.off("click", handler1);
      v.each(el => el.click());
      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler1).toHaveBeenCalledTimes(1);
    });
  });
});
