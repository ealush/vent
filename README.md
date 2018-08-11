# Vent
![img logo](https://raw.githubusercontent.com/ealush/vent/master/assets/logo.png?raw=true)

1.5Kb jQuery inspired events library for the browser.

```js
vent('a:first-child').on('click', (e) => {
    // do something
});
vent('a').add('button').off('click');
vent(window).trigger('scroll');
```

## Installation
You can either include vent's source as a script tag on your page, or
```npm i --save vent-dom```

## Mission
Even today, when jQuery is mostly unneeded due to the facts that most browsers are more or less standard compliant, jQuery’s api for dealing with DOM events is hands down the best.

It offers easy event delegation, removing listeners is as simple as `.off`, it handles custom events and more.
The only problem with jQuery is that it is huge (over 200kb), and mostly unneeded. Vent tries to provide all that goodness with just 1.5Kb.

### Welcome Vent.
Vent was written with jQuery in mind. It doesn’t support all of jQuery’s goodness, but it does maintain all the best parts.

## What Vent isn't?
* Vent is **NOT** jQuery. It is not a 100% jQuery compliant, but it does cover 95% of the use-cases handled by jQuery.
* Vent is not backwards compatible. It works across all modern browsers (Chrome, FF, Safari, Edge..), but requires polyfills to work on ie11. If for some reason you want your stuff to work on ie8, please, use jQuery.
* Vent is not a DOM manipulation library.

## Making it work with ie11
My personal recommendation is that you shouldn't support ie11 at all. If you are certain you want to do that, though - you should include `vent.min.es5.js` in your page, and also provide polyfills for Map and Set. https://polyfill.io/ is a good place to start.

## Vent's API
* `vent(selector)`: Most basic usage. Add elements to the set of elements.
```js
vent(window)
vent('a')
vent('body')
vent(document.body)
```

* `.on(events, handler)`: Registers a single or multiple events on the matched selectors.
It also handles delegations via selectors passed as the second argument.
```js
// regular usage
vent('li').on('click', (e) => {
    console.log('clicked!');
});

// multiple event matching
vent('li').on('click mouseenter', (e) => {
    console.log(e.type);
});

// event delegation
vent('ul').on('click', 'li:first-child', (e) => {
    console.log('clicked!');
});

// custom event matching
vent('li').on('sample-event', (e) => {
    console.log('custom event');
});
```

* `.off(events)`: Unregisters events handlers bound using `.on`. When no events passed
```js
vent('a').off('click'); // unregisters all click events bound using 'on()'
vent('a').off('click mouseenter'); // unregisters all click and mouseenter events bound using 'on()'
vent('a').off(); // unregisters all events bound using 'on()'
```

* `.once(events, delegatedTarget, handler)`: exactly like `.on`, but gets triggered only once. Does not respect `.off`!
```js
vent('a').once('click', () => {
    console.log('this will only happen once');
});
```

* `.trigger(event, { data, options })`: Triggers an event. Accepts data and custom options. By default triggered events get `bubbles: true` (can be overridden with custom options).

Custom data will appear under `detail` property of the event.
```js
// regular use
vent('a').trigger('click');

// with data
vent('a').trigger('click', {data: 'custom data'});

vent('a').trigger('sample', {options: {bubbles: false}});
```

* `.add(selector)`: extends Vent set with more elements
```js
const v = vent('a');
v.add(window);
v.add('li')
```

---
Icon made by [hirschwolf](https://www.flaticon.com/authors/hirschwolf) from [www.flaticon.com](www.flaticon.com).