(() => {
    const allEventTypes = new Set();
    const savedEvents =  new Map();

    function splitEvents(events) {

        if (typeof events !== 'string') {
            return [];
        }

        return [...new Set(events.split(' ').filter(Boolean))];
    }

    function parseNode(nodes) {
        if (!nodes) {
            return [];
        }

        if (typeof nodes === 'string') {
            return document.querySelectorAll(nodes);
        } else if (nodes instanceof NodeList) {
            return nodes;
        } else if (typeof nodes.addEventListener === 'function') {
            return [nodes];
        }

        return [];
    }

    function isTarget(target, delegatedTarget) {
        if (!delegatedTarget || typeof delegatedTarget !== 'string') {
            return true;
        }

        return matches(target, delegatedTarget);
    }

    function listen(target, event, handler, { delegatedTarget, once }) {
        const delegate = (e) => {
            if (isTarget(e.target, delegatedTarget)) {
                const data = e && e.detail;
                handler.call(target, e, data);

                if (once) {
                    target.removeEventListener(event, delegate);
                }
            }
        };

        target.addEventListener(event, delegate);

        if (!once) {
            setEvent(target, event, delegate);
        }
    }

    function setEvent(target, event, handler) {

        if (!target || !event || !handler) {
            return;
        }
        const targetEvents = savedEvents.get(target) || {};
        targetEvents[event] = targetEvents[event] || [];
        targetEvents[event].push(handler);
        savedEvents.set(target, targetEvents);
    }

    function deleteEvents(target, events) {
        const targetEvents = savedEvents.get(target);

        const eventsArray = splitEvents(events);

        for (const event in targetEvents) {
            if ((eventsArray.includes(event) || !events)
                && targetEvents.hasOwnProperty(event)
                && Array.isArray(targetEvents[event])) {
                targetEvents[event].forEach((handler) => target.removeEventListener(event, handler));
                delete targetEvents[event];
            }
        }

        if (!events) {
            savedEvents.delete(target)
        }
    }

    function matches(target, selector) {
        if (!target) { return false; }

        if (typeof target.matches === 'function') {
            return target.matches(selector);
        } else if (typeof target.msMatchesSelector !== 'function') {
            return target.msMatchesSelector(selector);
        }

        return false;
    }

    function isNativeEvent(event) {
        return allEventTypes.has(event);
    }

    function dispatch(target, events, detail, options) {
        if (!target.dispatchEvent) {
            return;
        }

        splitEvents(events).forEach((eventName) => {
            let event;

            if (detail || !isNativeEvent(eventName)) {
                event = new CustomEvent(eventName, Object.assign({ detail, bubbles: true }, options));
            } else {
                event = new Event(eventName, Object.assign({ bubbles: true }, options));
            }

            target.dispatchEvent(event);
        });
    }

    function naivelyListEvents() {
        for (const key in document) {
            if (key.substring(0, 2) === 'on') {
                allEventTypes.add(key.slice(2));
            }
        }
    }

    function bindEvent(instance, options = {}, ...args) {
        if (args.length < 2) {
            return instance;
        }

        const events = args[0];
        const handler = args[args.length - 1];
        let delegatedTarget;

        if (args.length === 3) {
            delegatedTarget = args[1];
        }

        const eventsArray = splitEvents(events);
        instance.forEach((node) => {
            eventsArray.forEach((event) => listen(node, event, handler, Object.assign({}, options, { delegatedTarget })));
        });
        return instance
    }


    class Vent {
        constructor(...args) {
            this.list = new Set();
            this.add(...args);
            return this;
        }

        add(...args) {
            args.forEach((node) => {
                const nodeList = parseNode(node);
                Array.prototype.forEach.call(nodeList, (n) => {
                    this.list.add(n);
                }, this);
            }, this);
            return this;
        }

        on(...args) {
            bindEvent(this, {}, ...args);
            return this;
        }

        once(...args) {
            bindEvent(this, { once: true }, ...args);
            return this;
        }

        forEach(callback, context = this) {
            this.list.forEach(callback, context);
            return this;
        }

        off(events) {
            this.forEach((target) => deleteEvents(target, events));
            return this;
        }

        trigger(events, { data, options } = {}) {
            this.forEach((target) => dispatch(target, events, data, options));
            return this;
        }
    }

    const v = (node) => {
        return new Vent(node);
    }

    naivelyListEvents();
    window.vent = v;
    return v;
})();
