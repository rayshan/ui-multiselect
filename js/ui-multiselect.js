app.filter('underline', function () {
	return function (text, query) {
		if (query.length > 0 || angular.isNumber(query)) {
			text = text.toString(); query = query.toString();
			return text.replace(new RegExp(query, 'gi'), '<span class="underline">$&</span>');
		} else return text;
	};
});

app.directive('uiMultiselect', function () {
	return {
		templateUrl: 'ui-multiselect.html',
		scope: {
			data: '=data',
			output: '=output'
		},
		link: function (scope, element, attrs) {
			scope.showDebug = true;
			scope.showSelectorDebug = true;

			scope.query = "";
			scope.limitFilter = attrs.limitFilter;

			scope.width = attrs.width;

			if (attrs.placeholder) {
				scope.placeholder = attrs.placeholder;
			} else {
				scope.placeholder = '';
			}

			scope.$watch('query', function (newValue) {
				var length = newValue.length > 0 ? newValue.length : scope.placeholder.length;
				scope.inputWidth = scope.placeholder.length > 0 ? 10 + length * 6 : 100;
			});

			scope.addItem = function (item, position, $event) {
				scope.output.splice(position, 0, item); // adds before position
				scope.query = [];
				if ($event && $event.keyCode === 1) scope.hoverSelector = false; // mouse click hides selector
			};
			scope.removeItem = function (position) {
				scope.output.splice(position, 1); // splice @ exact location
			};

			scope.focusChoice = []; // hide removeItem x button

			scope.focus = function () {
				scope.focusInput = true;
				scope.selectorPosition = undefined; // start @ first item
			};
			scope.blur = function () {
				scope.focusInput = false;
//				scope.query = [];
//				scope.inputPosition = undefined; // blur happens first before addItem
			};

			scope.hoverSelector = false;
			scope.showSelector = false;
			scope.$watch('[focusInput, hoverSelector]', function (newValue) {
				scope.showSelector = newValue.some(function (element) {return element});
			}, true); // selector should still show if input still focused, even if not hovered

			scope.keyParser = function ($event) {
				var keys = {
					38: 'up',
					40: 'down',
					8 : 'backspace',
					13: 'enter',
					9 : 'tab',
					27: 'esc'
				}; var key = keys[$event.keyCode];

				if (!key || (key === 'backspace' && scope.query.length !== 0)) {
					// backspace should work if !!query
					scope.selectorPosition = undefined;
				} else {
					var atTop = scope.selectorPosition === 0;
					var atBottom = scope.selectorPosition === scope.filteredData.length - 1;
					var choiceFocused = scope.focusChoice[scope.output.length - 1] === true;
					var filteredDataExists = scope.filteredData.length > 0;

					if (key === 'up') {
						if (atTop || !scope.selectorPosition) {
							scope.selectorPosition = scope.filteredData.length - 1;
						} else scope.selectorPosition--;
					} else if (key === 'down') {
						console.log(scope.selectorPosition);
						if (!scope.selectorPosition && scope.selectorPosition != 0) {
							scope.selectorPosition = 0;
						} else if (atBottom) {
							scope.selectorPosition = 0;
						} else scope.selectorPosition++;
					} else if (key === 'backspace') {
						if (choiceFocused) {
							scope.removeItem(scope.output.length - 1);
							scope.focusChoice = [];
						} else { // !choiceFocused
							scope.focusChoice[scope.output.length - 1] = true;
						}
					} else if ((key === 'enter' || key === 'tab') && filteredDataExists) {
						scope.addItem(scope.filteredData[scope.selectorPosition], scope.output.length);
					} else if (key === 'esc' && !!scope.focusChoice) scope.focusChoice = [];

					$event.preventDefault();
				}
//				console.log(key);
			};

		}
	}
});
