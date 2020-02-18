async function addEl() {
	let result = await fetch('/functions/autocomplete')
	let data = await result.json()

	var options = {
		data: data,

		getValue: function(el) {
			return el.settings.displayName
		},

		template: {
			type: 'custom',
			method: function(value, item) {
				return value.length > 0 ? value + ' - ' + item.username : item.username
			},
		},

		list: {
			onSelectItemEvent: function() {
				var value = $('#shareAutoSug').getSelectedItemData().username
				$('#hiddenUsername')
					.val(value)
					.trigger('change')
			},
		},

		theme: 'plate-dark',
	}

	$('#shareAutoSug').easyAutocomplete(options)
}

addEl()
