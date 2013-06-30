angular.module('underline', []).filter('underline', [function () {
	return function (text, query) {
		if (query.length > 0 || angular.isNumber(query)) {
			text = text.toString(); query = query.toString();
			return text.replace(new RegExp(query, 'gi'), '<span class="underline">$&</span>');
		} else return text;
	};
}]); // filter for underlining searched letters

angular.module('ui.multiselect', []).directive('uiMultiselect', [function () {
	return {
		templateUrl: 'ui-multiselect.html',
		scope: {
			data: '=data',
			output: '=output'
		},
		link: function (scope, element, attrs) {
			scope.query = "";
			scope.limitFilter = attrs.limitFilter; // limits # of items shown in selector
			scope.width = attrs.width;

			scope.$watch('output', function (newValue) {
				if (newValue.length === 0) {
					scope.placeholder = attrs.placeholder ? attrs.placeholder : ''
				} else scope.placeholder = '';
			}, true); // set placeholder & remove when there's output to save space

			scope.$watch('query', function (newValue) {
				var length = scope.placeholder.length;
				if (newValue.length > 0) length = newValue.length;
				scope.inputWidth = 10 + length * 6;
			}); // expand input box width based on content

			scope.addItem = function (item) {
				scope.output.push(item);
				scope.query = [];
			};
			scope.removeItem = function (position) {
				scope.output.splice(position, 1); // splice @ exact location
			};

			scope.focusChoice = []; // clears focus on any chosen item for del

			scope.focus = function () {
				scope.focusInput = true;
				scope.selectorPosition = 0; // start @ first item
			};
			scope.blur = function () {
				scope.focusInput = false;
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
				};
				var key = keys[$event.keyCode];
				var queryIsEmpty = scope.query.length === 0;

				if (!key || (key === 'backspace' && !queryIsEmpty)) {
					// backspace should work when query isn't empty
					scope.selectorPosition = 0;
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
						if (atBottom) {
							scope.selectorPosition = 0;
						} else scope.selectorPosition++;
					} else if (key === 'backspace') {
						if (choiceFocused) {
							scope.removeItem(scope.output.length - 1);
							scope.focusChoice = [];
						} else scope.focusChoice[scope.output.length - 1] = true;
					} else if ((key === 'enter' || key === 'tab') && filteredDataExists) {
						scope.addItem(scope.filteredData[scope.selectorPosition], scope.output.length);
					} else if (key === 'esc' && !!scope.focusChoice) scope.focusChoice = [];

					$event.preventDefault();
				}
			}; // keyboard shortcuts

		}
	}
}]);