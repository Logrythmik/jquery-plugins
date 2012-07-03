(function ($) {

    function ajaxLabel(el, options) {
        var self = this;
        // default settings
        this.defaults = {
			// url:
			// --------------------------------------------------------------------
			// The url to send the form to. The response is expected to look like this,
			// JSON:
			// { 
			//	success: true|false, 
			//  message: "The message you want to display." 
			//  (anything else you want here)
			// }
            url: null,
            viewClass: "ajaxLabelView",
            editClass: "ajaxLabelEdit",
			buttonClass: "ajaxLabelControl",
			
			// Contents defaulted to use Twitter Bootstrapper icons
			viewEditButton: "<a style='margin-left:6px'></a>",
			viewEditButtonContents: "<i title='Editable' class='icon-edit'></i>",
			
			editSaveButton: "<a class='btn btn-small'/>",
			editSaveButtonContents: "<i class='icon-save'></i>",
			
			editCancelButton: "<a class='btn btn-small'/>",
			editCancelButtonContents: "<i class='icon-ban-circle'></i>",
			
			// model properties: 
			// --------------------------------------------------------------------
			// model.self: this plugin
			// model.element: the element this plugin was bound too.
			// model.viewPane: the jQuery object, bound to the view pane.
			// model.editPane: the jQuery object, bound to the edit pane.
			
			// validate:
			// --------------------------------------------------------------------
			// The form will be serialized and passed into this function as "model".
			// Perform any validation, and return and object that looks like this:			
			// Validation Result:
			// { valid: true|false, message: "The message you want to display if failed validation." }
            validate: function (model) { 
				return new { valid: true, message: "" }; 
			},						
			// success:
			// --------------------------------------------------------------------
			// When the response is returned from the server, and the 
			// response.success value is true, this callback will be executed. Use
			// this to render your result. You get the json response object and the 
			// model as described above.
			success: function (response, model) { 
			},
			// error:
			// --------------------------------------------------------------------
			// When the response is returned from the server, and the 
			// response.success value is true, this callback will be executed. Use
			// this to render your result. You get the ajax response object and the 
			// model as described above.
            error: function (message, model) {
                 self.message(message);
            },			
			// message:
			// -------------------------------------------------------------------
			// All messages can be handled here.
			message: function (message) {
                 alert(message);
            },
			// log:
			// -------------------------------------------------------------------
			// All errors are logged too.
            log: function (message) {
                 console.log(message);
            }
        };

        //Extending options:
        this.$opts = $.extend({}, this.defaults, options);

        //Privates:
        this.$el = $(el);

        this.$loading = $("<img src='images/loading.gif' alt='Loading...' style='margin-left:4px'/>").hide();

        this.$model = {
            self: self,
            element: this.$el,
            viewPane: this.$el.children(this.$opts.viewClass),
            editPane: this.$el.children(this.$opts.editClass)
        };
    }

    // Separate functionality from object creation
    ajaxLabel.prototype = {
        init: function () {
            var self = this;
            self._initViewPane();
            self._initEditPane();
        },
        _initEditPane: function () {
            var self = this;

            //self.$model.editPane.hide();

			var editSaveButton = $(self.$opts.editSaveButton)
				.addClass(self.$opts.buttonClass)
				.html(self.$opts.editSaveButtonContents)
				.attr("title", "Save")
                .click(function () {
                    self.submit();
                });

            var editCancelButton = $(self.$opts.editCancelButton)
				.addClass(self.$opts.buttonClass)
				.html(self.$opts.editCancelButtonContents)
				.attr("title", "Cancel")
                .click(function () {
                    self.toggle();
                });

            var editButtons = $("<span class='btn-group'></span>")
                .append(editSaveButton)
                .append(editCancelButton);

            self.$model.editPane
                .append(editButtons)
                .append(this.$loading);
        },
        _initViewPane: function () {
            var self = this;
            var viewEditIcon = $(self.$opts.editButton)
				.addClass(self.$opts.buttonClass)
				.attr("title", "Edit")
				.html(self.$opts.editButtonContents);				
            self.$model.viewPane.text($.trim(self.$model.viewPane.text()));
            self.$model.viewPane
                .wrapInner("<a class='display'/>")
                .append(viewEditIcon)
                .click(function () { self.toggle(); });
        },
        toggle: function () {
            var self = this;
            self.$model.viewPane.toggle();
            self.$model.editPane.toggle();
        },
        submit: function () {
            var self = this;

            var inputs = self.$model.editPane.children(":input").serialize();
            var url = self.$opts.url || self.$el.data("url");
            if (url == null || url == "" || url == undefined) {
                self.error("No url was specified. Please add a 'data-url' attribute to the element.");
                return;
            }
            var result = ($.isFunction(self.$opts.validate)) ?
                self.$opts.validate(self.$model) : { valid: true };

            if (result.valid) {
                document.body.style.cursor = "wait";
                self.$loading.show();
                $.post(url, inputs, function (response) {
                    self.success(response);
                    document.body.style.cursor = "default";
                    self.$loading.hide();
                });
            } else {
                self.error(result.message);
            }
        },
        success: function (response) {
            var self = this;
            if (response.success) {
                self.toggle();
                if ($.isFunction(self.$opts.success)) {
                    self.$opts.success(response, self.$model);
                    self._initViewPane();
                }
                self.$opts.message(response.message);
            } else {
                self.error(response.message);
            }
        },
        error: function (message) {
            var self = this;
            self.$opts.log(message);
            if ($.isFunction(self.$opts.error))
                self.$opts.error(message, self.$model);
        }
    };

    // The actual plugin
    $.fn.ajaxLabel = function (options) {
        if (this.length) {
            this.each(function () {
                var instance = new ajaxLabel(this, options);
                instance.init();
                $(this).data('ajaxLabel', instance);
            });
        }
    };
})(jQuery);