require('../lib/vent.min.js');

const selectors = [".some-class", "#some-list", "li:nth-child(2)"];

describe("vent.add", () => {
  let rootElement, v;

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

    v = vent();
    v.add(...selectors);
  });

  afterEach(() => {
    rootElement.remove();
  });

  it("Should add found elements to instance", () => {
    v.each((e, i) => {
      expect(e).toBe(document.querySelector(selectors[i]));
    });
  });

  it("Should increase the length with the number of found elements", () => {
    expect(v.length).toBe(selectors.length);
    v.add(".i-do-not-exist");
    expect(v.length).toBe(selectors.length);
  });

  it("Should skip already existing items", () => {
    const currentLength = v.length;
    v.add(selectors[0]);
    expect(v.length).toBe(currentLength);
  });

  it("Should return current instance", () => {
    expect(v.add(...selectors)).toBe(v);
  });
});
