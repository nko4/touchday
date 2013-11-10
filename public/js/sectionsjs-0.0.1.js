/*! sectionsjs - v0.0.1 - 2013-10-15 | Copyright (c) 2013 Po-Ying Chen <poying.me@gmail.com> */

(function(window, document) {
    "use strict";
    var sections = window.sections = {};
    sections.config = {
        className: "section",
        marginTop: 0,
        interval: 200,
        autoSectionHeight: true
    };
    sections.utils = {};
    sections.utils.getInlineCSS = function(element) {
        var style = element.getAttribute("style") || "";
        var regexp = /([^:\s]+)\s*:\s*([^;]+)/g;
        var data = {};
        style.replace(regexp, function(origin, key, value) {
            data[key] = value.trim();
        });
        return data;
    };
    sections.utils.setInlineCSS = function(element, style) {
        var oldStyle = sections.utils.getInlineCSS(element);
        var newStyle = [];
        var i;
        for (i in style) {
            if (style.hasOwnProperty(i)) {
                oldStyle[i] = style[i];
            }
        }
        for (i in oldStyle) {
            if (oldStyle.hasOwnProperty(i)) {
                newStyle.push(i + ": " + oldStyle[i]);
            }
        }
        element.setAttribute("style", newStyle.join("; "));
        return oldStyle;
    };
    sections.events = {};
    sections.events.EventEmitter = function() {
        var EventEmitter = function() {
            this.events = {};
        };
        var on = EventEmitter.prototype.on = function(eventName, handler, isOnce) {
            var events = this.events;
            if (typeof handler === "function") {
                handler.once = !!isOnce;
                if (!events[eventName]) {
                    events[eventName] = [];
                }
                events[eventName].push(handler);
            }
            return this;
        };
        var addEventListener = EventEmitter.prototype.addEventListener = on;
        var once = EventEmitter.prototype.once = function(eventName, handler) {
            return this.on(eventName, handler, true);
        };
        var off = EventEmitter.prototype.off = function(eventName, handler) {
            var events = this.events;
            if (typeof handler === "function") {
                var handlers = events[eventName] || [];
                var len = handlers.length;
                while (len--) {
                    if (handlers[len] === handler) {
                        handlers.splice(len, 1);
                    }
                }
            } else {
                delete events[eventName];
            }
            return this;
        };
        var removeEventListener = EventEmitter.prototype.removeEventListener = off;
        var emit = EventEmitter.prototype.emit = function(eventName) {
            var args = Array.prototype.slice.call(arguments, 1);
            var handlers = this.events[eventName] || [];
            var len = handlers.length;
            while (len--) {
                handlers[len].apply(this, args);
                if (handlers[len].once) {
                    handlers.splice(len, 1);
                }
            }
            return this;
        };
        var trigger = EventEmitter.prototype.trigger = emit;
        return EventEmitter;
    }();
    sections.Section = function() {
        var Section = function(element) {
            sections.events.EventEmitter.call(this);
            this.element = element;
            this.updatePosition();
            this.progress = 0;
        };
        Section.prototype = new sections.events.EventEmitter();
        Section.prototype.updatePosition = function() {
            var rect = this.element.getBoundingClientRect();
            this.left = rect.left;
            this.right = rect.right;
            this.top = rect.top;
            this.bottom = rect.bottom;
            return this;
        };
        Section.prototype.getCSS = function(key) {
            var css = sections.utils.getInlineCSS(this.element);
            return key ? css[key] : css;
        };
        Section.prototype.setCSS = function(css) {
            sections.utils.setInlineCSS(this.element, css);
            return this;
        };
        Section.prototype.updateProgress = function(pageTop, pageHeight) {
            var height = this.getHeight();
            var progress;
            if (pageTop + pageHeight > this.top && pageTop <= this.top + height) {
                var pos = this.top - pageTop;
                progress = pos / (pos > 0 ? pageHeight : height) * 100;
                progress = progress > 0 ? 100 - progress : progress;
            } else {
                progress = this.top - pageTop > 0 ? 0 : -100;
            }
            if (this.progress !== progress) {
                this.progress = progress;
                this.emit("progress", progress);
            }
            return this;
        };
        Section.prototype.getHeight = function() {
            return this.element.offsetHeight;
        };
        return Section;
    }();
    sections.proto = new sections.events.EventEmitter();
    sections.proto.start = function() {
        this.__started = true;
        this.getSections();
        this.updateWindowSize();
        this.addScrollEventHandler();
        this.getScrollHeight();
        this.addWindowResizeHandler();
        this.updateProgress();
        this.lazyApply();
        return this;
    };
    sections.proto.getScrollHeight = function() {
        var body = document.body;
        var documentElement = document.documentElement;
        this.scrollHeight = body.scrollHeight || documentElement.scrollHeight || 0;
        return this;
    };
    sections.proto.getSections = function() {
        this.sections = [];
        var elements = document.getElementsByClassName(this.config.className) || [];
        var len = elements.length;
        var index;
        for (index = 0; index < len; index += 1) {
            this.sections.push(new sections.Section(elements[index]));
        }
        return this;
    };
    sections.proto.addScrollEventHandler = function() {
        var that = this;
        setInterval(function() {
            var scrollOffset = {
                x: 0,
                y: 0
            };
            if (window.pageYOffset) {
                scrollOffset.y = window.pageYOffset;
                scrollOffset.x = window.pageXOffset;
            } else if (document.body && document.body.scrollLeft) {
                scrollOffset.y = document.body.scrollTop;
                scrollOffset.x = document.body.scrollLeft;
            } else if (document.documentElement && document.documentElement.scrollLeft) {
                scrollOffset.y = document.documentElement.scrollTop;
                scrollOffset.x = document.documentElement.scrollLeft;
            }
            that.top = scrollOffset.y;
            that.left = scrollOffset.x;
            that.checkCurrentSection();
            that.updateProgress();
        }, this.config.interval);
        return this;
    };
    sections.proto.updateWindowSize = function() {
        var documentElement = document.documentElement;
        var body = document.body;
        var width = window.innerWidth || documentElement.clientWidth || body.clientWidth;
        var height = window.innerHeight || documentElement.clientHeight || body.clientHeight;
        this.width = width;
        this.height = height;
        if (this.config.autoSectionHeight) {
            this.each(function(index, section) {
                section.setCSS({
                    height: height + "px"
                });
                section.updatePosition();
            });
        }
        return this;
    };
    sections.proto.addWindowResizeHandler = function() {
        var that = this;
        var onResize = function() {
            that.updateWindowSize();
        };
        window.addEventListener("resize", onResize);
        onResize();
        return this;
    };
    sections.proto.checkCurrentSection = function() {
        var that = this;
        var prevIndex = this.__currentIndex | 0;
        this.each(function(index, section) {
            if (that.top >= section.top && that.top < section.top + section.getHeight() && index !== prevIndex) {
                that.__currentIndex = index;
                var prev = that.get(prevIndex);
                var current = that.get(index);
                that.emit("changed", current, prev);
                if (prev) {
                  prev.emit("scrollOut", prevIndex < index ? 1 : -1);
                }
                current.emit("scrollIn", prevIndex > index ? 1 : -1);
                return false;
            }
        });
        return this;
    };
    sections.proto.updateProgress = function() {
        var last = this.last();
        var that = this;
        var progress = this.top / (this.scrollHeight - last.getHeight()) * 100;
        if (this.progress !== progress) {
            this.progress = progress;
            this.emit("progress", progress);
        }
        this.each(function(index, section) {
            section.updateProgress(that.top, that.height);
        });
        return this;
    };
    sections.proto.lazyApply = function() {
        var allfn = this.__lazyApply;
        var len = allfn.length;
        while (len--) {
            allfn[len]();
        }
        return this;
    };
    sections.proto.current = function() {
        return this.get(this.currentIndex());
    };
    sections.proto.last = function() {
        return this.get(this.sections.length - 1);
    };
    sections.proto.first = function() {
        return this.get(0);
    };
    sections.proto.currentIndex = function() {
        return this.__currentIndex | 0;
    };
    sections.proto.get = function(index) {
        return this.sections[index] || null;
    };
    sections.proto.section = function(index, fn) {
        if (!this.__started) {
            var that = this;
            this.__lazyApply.push(function() {
                that.section(index, fn);
            });
        } else {
            if (typeof fn === "function") {
                switch (index) {
                  case "first":
                    index = 0;
                    break;

                  case "last":
                    index = this.sections.length - 1;
                    break;

                  default:
                    index = index | 0;
                }
                var section = this.get(index);
                if (section) {
                    fn.call(section, section);
                }
            }
        }
        return this;
    };
    sections.proto.each = function(fn) {
        var items = this.sections || [];
        var len = items.length;
        var index;
        for (index = 0; index < len; index += 1) {
            if (fn.call(items[index], index, items[index]) === false) {
                break;
            }
        }
        return this;
    };
    sections.Sections = function(config) {
        sections.events.EventEmitter.call(this);
        config = config || {};
        var defConfig = sections.config;
        var i;
        for (i in defConfig) {
            if (defConfig.hasOwnProperty(i) && !config.hasOwnProperty(i)) {
                config[i] = defConfig[i];
            }
        }
        this.__started = false;
        this.__currentIndex = -1;
        this.config = config;
        this.width = 0;
        this.height = 0;
        this.top = 0;
        this.left = 0;
        this.__lazyApply = [];
    };
    sections.Sections.prototype = sections.proto;
    sections.create = function(config) {
        return new sections.Sections(config);
    };
})(this, this.document);
