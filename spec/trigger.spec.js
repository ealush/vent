require('../lib/vent.js');

describe('Vent: trigger', () => {
    let markup, rootElement;

    beforeEach(() => {
        rootElement = document.createElement('div');
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
    });

    afterEach(() => {
        rootElement.remove();
    });

    it('Should return current instance', () => {
        const v = vent('li');
        expect(v.trigger('click')).toBe(v);
    });

    describe('Native events', () => {
        describe('new Event', () => {
            const _Event = Event;
            const _CustomEvent = CustomEvent;

            beforeEach(() => {
                Event = jest.fn();
                CustomEvent = jest.fn();
            });

            afterEach(() => {
                Event = _Event;
                CustomEvent = _CustomEvent;
            });

            describe('Without custom data', () => {
                it('Should create a new Event instance', () => {
                    vent('li')
                        .forEach((node) => node.dispatchEvent = jest.fn)
                        .trigger('click');
                    expect(Event).toHaveBeenCalledTimes(vent('li').list.size);
                });

                it('Should set event bubbling to `true`', () => {
                    vent('li')
                        .forEach((node) => node.dispatchEvent = jest.fn)
                        .trigger('click');

                    expect(Event.mock.calls[0]).toEqual([
                        'click', { bubbles: true }
                    ]);
                });
            });

            describe('With custom data', () => {
                it('Should create a new CustomEvent instance', () => {
                    vent('li')
                        .forEach((node) => node.dispatchEvent = jest.fn)
                        .trigger('click', {data: { sample: 'data' }});
                    expect(CustomEvent).toHaveBeenCalledTimes(vent('li').list.size);
                });

                it('Should set event bubbling to `true` and `detail` to passed data', () => {
                    vent('li')
                        .forEach((node) => node.dispatchEvent = jest.fn)
                        .trigger('click', {data: { sample: 'data' }});

                    expect(CustomEvent.mock.calls[0]).toEqual([
                        'click', { bubbles: true, detail: { sample: 'data' } }
                    ]);
                });
            });

            describe('With custom configuration', () => {
                it('Should merge configuration with defaults', () => {
                    vent('a')
                        .forEach((node) => node.dispatchEvent = jest.fn)
                        .trigger('click', { options: { bubbles: false } });
                    expect(Event.mock.calls[0]).toEqual([
                        'click', { bubbles: false }
                    ]);
                });
            });
        });

        describe('dispatchEvent', () => {
            it('Should call dispatchEvent on elements', () => {
                const dispatchEvent = jest.fn();
                vent('li')
                    .forEach((node) => node.dispatchEvent = dispatchEvent)
                    .trigger('click');
                expect(dispatchEvent).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('CustomEvent', () => {
        describe('new Event', () => {
            const _Event = Event;
            const _CustomEvent = CustomEvent;

            beforeEach(() => {
                Event = jest.fn();
                CustomEvent = jest.fn();
            });

            afterEach(() => {
                Event = _Event;
                CustomEvent = _CustomEvent;
            });

            it('Should create a new CustomEvent instance', () => {
                vent('a')
                    .forEach((node) => node.dispatchEvent = jest.fn)
                    .trigger('sample');
                expect(CustomEvent).toHaveBeenCalledTimes(vent('a').list.size);
            });

            it('Should set event bubbling to `true` and `detail` to passed data', () => {
                vent('li')
                    .forEach((node) => node.dispatchEvent = jest.fn)
                    .trigger('sample', { data: { sample: 'data' } });

                expect(CustomEvent.mock.calls[0]).toEqual([
                    'sample', { bubbles: true, detail: { sample: 'data' } }
                ]);
            });

            describe('With custom configuration', () => {
                it('Should merge configuration with defaults', () => {
                    vent('a')
                        .forEach((node) => node.dispatchEvent = jest.fn)
                        .trigger('sample', { options: { bubbles: false } });
                    expect(CustomEvent.mock.calls[0]).toEqual([
                        'sample', { bubbles: false }
                    ]);
                });
            });
        });

        describe('dispatchEvent', () => {
            it('Should call dispatchEvent on elements', () => {
                const dispatchEvent = jest.fn();
                vent('li')
                    .forEach((node) => node.dispatchEvent = dispatchEvent)
                    .trigger('click');
                expect(dispatchEvent).toHaveBeenCalledTimes(2);
            });
        });
    });
});
