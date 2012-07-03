(function ($) {

    //This plugin creates the appended or prepended unit 
    function Amount(el, options) {

        //Defaults:
        this.defaults = {
            type: 'prepend',    // prepend | append
            value: '$'          // %, $, #, .00, etc.
        };

        //Extending options:
        this.opts = $.extend({}, this.defaults, options);

        //Privates:
        this.$el = $(el);
    }

    // Separate functionality from object creation
    Amount.prototype = {

        init: function (options) {
            var _this = this;

            var wrapper = $("<span class='amountWrapper input-" + _this.opts.type + "'/>");
            var addOn = $("<span class='add-on'>" + _this.opts.value + "</span>");

            _this.$el.css({ width: '185px'});
            _this.$el.wrap(wrapper);
            if (_this.opts.type === 'prepend') {
                addOn.insertBefore(_this.$el);
            } else if (_this.opts.type === 'append') {
                addOn.insertAfter(_this.$el);
            }
        },

        //Removes the wrapped code.
        clear: function () {
            var _this = this;
            _this.$el.parent('.amountWrapper').replaceWith(_this.$el);
        }
    };

    // The actual plugin
    $.fn.amount = function (options) {
        if (this.length) {
            this.each(function () {
                var rev = $(this).data('amount');

                if (rev) rev.clear();

                rev = new Amount(this, options);
                $(this).data('amount', rev);
                rev.init();
            });
        }
    };
})(jQuery);