/**
 * jQuery.Preload - Multifunctional preloader
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com
 * Dual licensed under MIT and GPL.
 * Date: 3/25/2009
 * @author Ariel Flesler
 * @version 1.0.8
 */
;
(function($) {
    var h = $.preload = function(c, d) {
        if (c.split) c = $(c);
        d = $.extend({}, h.defaults, d);
        var f = $.map(c, function(a) {
                if (!a) return;
                if (a.split) return d.base + a + d.ext;
                var b = a.src || a.href;
                if (typeof d.placeholder == 'string' && a.src) a.src = d.placeholder;
                if (b && d.find) b = b.replace(d.find, d.replace);
                return b || null
            }),
            data = {
                loaded: 0,
                failed: 0,
                next: 0,
                done: 0,
                total: f.length
            };
        if (!data.total) return finish();
        var g = $(Array(d.threshold + 1).join('<img/>')).load(handler).error(handler).bind('abort', handler).each(fetch);

        function handler(e) {
            data.element = this;
            data.found = e.type == 'load';
            data.image = this.src;
            data.index = this.index;
            var a = data.original = c[this.index];
            data[data.found ? 'loaded' : 'failed']++;
            data.done++;
            if (d.enforceCache) h.cache.push($('<img/>').attr('src', data.image)[0]);
            if (d.placeholder && a.src) a.src = data.found ? data.image : d.notFound || a.src;
            if (d.onComplete) d.onComplete(data);
            if (data.done < data.total) fetch(0, this);
            else {
                if (g && g.unbind) g.unbind('load').unbind('error').unbind('abort');
                g = null;
                finish()
            }
        };

        function fetch(i, a, b) {
            if (a.attachEvent && data.next && data.next % h.gap == 0 && !b) {
                setTimeout(function() {
                    fetch(i, a, 1)
                }, 0);
                return !1
            }
            if (data.next == data.total) return !1;
            a.index = data.next;
            a.src = f[data.next++];
            if (d.onRequest) {
                data.index = a.index;
                data.element = a;
                data.image = a.src;
                data.original = c[data.next - 1];
                d.onRequest(data)
            }
        };

        function finish() {
            if (d.onFinish) d.onFinish(data)
        }
    };
    h.gap = 14;
    h.cache = [];
    h.defaults = {
        threshold: 2,
        base: '',
        ext: '',
        replace: ''
    };
    $.fn.preload = function(a) {
        h(this, a);
        return this
    }
})(jQuery);