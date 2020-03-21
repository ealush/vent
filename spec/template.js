require('../lib/vent.min.js');

const selectors = [".some-class", "#some-list", "li:nth-child(2)"];

describe("vend.", () => {
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
  });

  afterEach(() => {
    rootElement.remove();
  });
});
