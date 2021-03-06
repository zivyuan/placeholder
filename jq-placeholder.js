//
// placeholder
//
(function($) {
	function isPlaceholder() {
		var input = document.createElement('input');
		return 'placeholder' in input;
	}

	var PH_datakey = '_PHdatakey';

	function _addHolderFor(obj) {
		if (obj.data(PH_datakey))
		// Remove previous placeholder if exists
			obj.data(PH_datakey).remove();
		// prevent placeholder if input was on focus
		if (obj.data('prevent-ph') === true) return;

		if ($.trim(obj.val()) != '') return;

		// Fix margin and border widths
		var mt = parseFloat(obj.css('margin-top')),
			ml = parseFloat(obj.css('margin-left')),
			bt = parseFloat(obj.css('border-top-width')),
			bl = parseFloat(obj.css('border-left-width'));
		mt = isNaN(mt) ? 3 : (mt + 3);
		ml = isNaN(ml) ? 3 : (ml + 3);
		mt += isNaN(bt) ? 0 : bt;
		ml += isNaN(bl) ? 0 : bl;
		var style = {
			'padding-left': obj.css('padding-left'),
			'padding-top': obj.css('padding-top'),
			'margin-left': ml + 'px',
			'margin-top': mt + 'px',
			'top': obj.position().top + 'px',
			'left': obj.position().left + 'px',
			'width': obj.width(),
			'height': obj.height(),
			'font-size': obj.css('font-size'),
			'line-height': obj.css('line-height'),
			'vertical-align': obj.css('vertical-align'),
			//
			'fakeitem': 0
		};
		var stylefix = 'position:absolute;overflow:hidden;z-index:99999;';
		for (var key in style) {
			stylefix += key + ':' + style[key] + ';';
		}
		var holder = $('<div class="placeholder" style="' + stylefix + '">' + obj.attr('placeholder') + '</div>');
		holder.click(function() {
			obj.trigger('focus').data(PH_datakey, null);
			$(this).remove();
		});
		obj.data(PH_datakey, holder);
		holder.insertAfter(obj);
		// $(document.body).append(holder);
	}

	$.fn.placeholder = function() {
		if (isPlaceholder()) return;
		//
		return this.each(function() {
			var th = $(this),
				ph = th.attr('placeholder');
			// Skip item with no placeholder set
			if (!(ph && ph.length > 0)) {
				return;
			}

			_addHolderFor(th);
			if (th.data('PH-initialed') === true)
				return;

			th.focusout(function() {
				th.data('prevent-ph', false);
				_addHolderFor($(this));
			}).focusin(function() {
				var th = $(this),
					ph = th.data(PH_datakey);
				th.data('prevent-ph', true);
				if (ph) ph.remove();
			}).data('PH-initialed', true);
		}); // end for each
	}; // end of functions

	$(function() {
		// Auto initial form item witch has placeholder
		$('input[placeholder], textarea[placeholder]').placeholder();
	});
})(jQuery);