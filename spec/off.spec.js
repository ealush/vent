require('../lib/vent.js');

describe('Vent: off', () => {
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
        expect(v.off('click')).toBe(v);
    });

    describe('call removeEventListener', () => {
        describe('events were added using `on`', () => {
            it('Should call removeEventListener for every matched element', () => {
                const remove = jest.fn();
                const handler = jest.fn();
                const v = vent('li');
                v.on('click', handler);
                v.forEach((node) => node.removeEventListener = remove);
                v.off('click');
                expect(remove).toHaveBeenCalledTimes(2);
            });

            test('Event handler is not called when triggered', () => {
                const remove = jest.fn();
                const handler = jest.fn();
                vent('li')
                    .on('click', handler)
                    .off('click')
                    .trigger('click');
                expect(handler).toHaveBeenCalledTimes(0);
            });
        });

        describe('events were not added using `on`', () => {
            it('Should exit without calling addEventListener', () => {
                const remove = jest.fn();
                const handler = jest.fn();
                const v = vent('li');
                v.forEach((node) => node.removeEventListener = remove);
                v.off('click');
                expect(remove).toHaveBeenCalledTimes(0);
            });
        });
    });

    describe('No events', () => {
        it('Should call removeEventListener for all registered events', () => {
            const remove = jest.fn();
            const handler = jest.fn(console.log);
            vent('a')
                .on('click mouseenter', handler)
                .forEach((node) => node.removeEventListener = remove)
                .off();
            expect(remove).toHaveBeenCalledTimes(2);
        });
    });

    describe('Multiple events', () => {
        it('Should accept space delimited events', () => {
            const remove = jest.fn();
            vent('a')
                .on('click mouseenter', jest.fn())
                .forEach((node) => node.removeEventListener = remove)
                .off('click mouseenter');
            expect(remove).toHaveBeenCalledTimes(2);
        });

        it('Should prevent duplication when removing events', () => {
            const remove = jest.fn();
            vent('a')
                .on('click click', jest.fn)
                .forEach((node) => node.removeEventListener = remove)
                .off('click click');
            expect(remove).toHaveBeenCalledTimes(1);
        });
    });
});
