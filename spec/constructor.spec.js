require('../lib/vent.js');

const ventMethods = [
    'add',
    'on',
    'off',
    'once',
    'forEach',
    'off',
    'trigger'
];

describe('Vent: constructor', () => {

    describe('Vent methods', () => {
        it('Should expose all of vent methods', () => {
            ventMethods.forEach((methodName) => {
                expect(typeof vent()[methodName]).toBe('function');
            });
        });

        it('Should expose all as prototype methods', () => {
            ventMethods.forEach((methodName) => {
                expect(vent().hasOwnProperty(methodName)).toBe(false); // eslint-disable-line
            });
        });

        it('Should have an array named `list`', () => {
            expect(vent().hasOwnProperty('list')).toBe(true); // eslint-disable-line
            expect(Array.isArray(vent().list)).toBe(true);
        });
    });

    describe('Add on constructor', () => {
        let add;

        beforeEach(() => {
            add = jest.fn();
            vent().constructor.prototype.add = add;
        });

        afterEach(() => {
            vent().constructor.prototype.add.mockRestore();
        });

        it('Should call add with all passed arguments', () => {
            [
                '.some-class',
                window,
                null,
                undefined
            ].forEach((selector) => {
                vent(selector);
                expect(add).toHaveBeenCalledWith(selector);
            });
        });
    });
});
