require('../lib/vent.js');

describe('Vent: add', () => {
    let rootElement;

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
        expect(vent().add('.some-class').constructor.name).toBe('Vent');
    });

    describe('Selector matching', () => {

        it('Should populate `list` only with matched elements', () => {
            [
                'body',
                'ul.some-list',
                'a',
                'p',
                null
            ].forEach((selector) => {
                let element = document.querySelector(selector);
                expect(vent().add(selector).list.some((v) => v === element)).toBe(element ? true : false);
            });
        });

        it('Should accept Objects with `addEventListener` method', () => {
            [
                window,
                { addEventListener: () => null },
                document.body,
                new Object()
            ].forEach((obj) => {
                expect(vent().add(obj).list.some((v) => v === obj)).toBe(typeof obj.addEventListener === 'function');
            });
        });

        it('Should accept nodelist', () => {
            document.querySelectorAll('li').forEach((node) => {
                expect(vent().add(node).list.some((v) => v === node)).toBe(true);
            });
        });
    });

    describe('List population', () => {

        it('Should allow adding to an existing list', () => {
            const v = vent('a');
            v.add('li');
            expect(v.list.length).toBe(3);
            expect(v.list.some((v) => v === document.querySelector('a'))).toBe(true);
            document.querySelectorAll('li').forEach((node) => {
                expect(v.list.some((v) => v === node)).toBe(true);
            });
        });

        it('Should only add new items. No duplicates', () => {
            const v = vent('a');
            expect(v.list.length).toBe(1);
            v.add('a');
            expect(v.list.length).toBe(1);
        });
    });

});
