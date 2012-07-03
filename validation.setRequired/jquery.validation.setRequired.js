(function ($) {


    function Required(el, options) {

        //Defaults:
        this.defaults = {
            message: "This field is required."
        };

        //Extending options:
        this.opts = $.extend({}, this.defaults, options);

        //Privates:
        this.$el = $(el);
    }

    // Separate functionality from object creation
    Required.prototype = {
        init: function () {
            var _this = this;

            //_this.$el.next('span.required').remove();

            var addOn = $("<span class='required' title='Required'> *</span>");

            _this.$el.attr("data-val", true);
            _this.$el.attr("data-val-required", this.opts.message);

            addOn.insertAfter(_this.$el);
            
            var form = _this.$el.closest("form")
                .removeData("validator")
                .removeData("unobtrusiveValidation");

            $.validator.unobtrusive.parse(form);
        },
        //Removes the values.
        clear: function () {
            var _this = this;
            _this.$el.removeAttr("data-val");
            _this.$el.removeAttr("data-val-required");

            _this.$el.next('span.required').remove();
        }
    };

    // The actual plugin
    $.fn.setRequired = function (options) {
        if (this.length) {
            this.each(function () {
                var rev = $(this).data('required');

                if (rev) rev.clear();

                rev = new Required(this, options);

                rev.init();

                $(this).data('required', rev);
            });
        }
    };
})(jQuery);