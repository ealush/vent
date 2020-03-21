require('../lib/vent.min.js');

describe("Vent", () => {
  let rootElement;

  beforeEach(() => {
    rootElement = document.createElement("div");
    rootElement.innerHTML = `
        <div class="some-class">
            <ul id="some-list">
                <li class="child1">item:1</li>
                <li class="child2">item:2</li>
            </ul>
            <a href="#!">click me!</a>
        </div>
        `;
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    rootElement.remove();
  });

  it("Should return a new Vent instance", () => {
    expect(vent()).not.toBe(vent());
    expect(vent()).toEqual(vent());
  });

  it("Should initialize vent with length: 0", () => {
    expect(vent().length).toBe(0);
  });

  it("Should add found elements to instance", () => {
    const selectors = [".some-class", "#some-list", "li:nth-child(2)"];
    const v = vent(...selectors);
    v.each((e, i) => {
      expect(e).toBe(document.querySelector(selectors[i]));
    });
  });
});
