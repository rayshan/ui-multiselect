//noinspection JSCheckFunctionSignatures
var app = angular.module('app', ['ui.event']);

app.controller('MainCtrl', function ($scope) {
	$scope.data = [
		"United States",
		"Afghanistan",
		"Albania",
		"Algeria",
		"Andorra",
		"Angola",
		"Antigua and Barbuda",
		"Argentina",
		"Armenia",
		"Australia",
		"Austria",
		"Azerbaijan",
		"Bahamas",
		"Bahrain",
		"Bangladesh",
		"Barbados",
		"Belarus",
		"Belgium",
		"Belize",
		"Benin",
		"Bhutan",
		"Bolivia",
		"Bosnia and Herzegovina",
		"Botswana",
		"Brazil",
		"Brunei",
		"Bulgaria",
		"Burkina Faso",
		"Burundi",
		"Cambodia",
		"Cameroon",
		"Canada",
		"Cape Verde",
		"Central African Republic",
		"Chad",
		"Chile",
		"China",
		"Colombi",
		"Comoros",
		"Congo (Brazzaville)",
		"Congo",
		"Costa Rica",
		"Cote d'Ivoire",
		"Croatia",
		"Cuba",
		"Cyprus",
		"Czech Republic",
		"Denmark",
		"Djibouti",
		"Dominica",
		"Dominican Republic",
		"East Timor (Timor Timur)",
		"Ecuador",
		"Egypt",
		"El Salvador",
		"Equatorial Guinea",
		"Eritrea",
		"Estonia",
		"Ethiopia",
		"Fiji",
		"Finland",
		"France",
		"Gabon",
		"Gambia, The",
		"Georgia",
		"Germany",
		"Ghana",
		"Greece",
		"Grenada",
		"Guatemala",
		"Guinea",
		"Guinea-Bissau",
		"Guyana",
		"Haiti",
		"Honduras",
		"Hungary",
		"Iceland",
		"India",
		"Indonesia",
		"Iran",
		"Iraq",
		"Ireland",
		"Israel",
		"Italy",
		"Jamaica",
		"Japan",
		"Jordan",
		"Kazakhstan",
		"Kenya",
		"Kiribati",
		"Korea, North",
		"Korea, South",
		"Kuwait",
		"Kyrgyzstan",
		"Laos",
		"Latvia",
		"Lebanon",
		"Lesotho",
		"Liberia",
		"Libya",
		"Liechtenstein",
		"Lithuania",
		"Luxembourg",
		"Macedonia",
		"Madagascar",
		"Malawi",
		"Malaysia",
		"Maldives",
		"Mali",
		"Malta",
		"Marshall Islands",
		"Mauritania",
		"Mauritius",
		"Mexico",
		"Micronesia",
		"Moldova",
		"Monaco",
		"Mongolia",
		"Morocco",
		"Mozambique",
		"Myanmar",
		"Namibia",
		"Nauru",
		"Nepal",
		"Netherlands",
		"New Zealand",
		"Nicaragua",
		"Niger",
		"Nigeria",
		"Norway",
		"Oman",
		"Pakistan",
		"Palau",
		"Panama",
		"Papua New Guinea",
		"Paraguay",
		"Peru",
		"Philippines",
		"Poland",
		"Portugal",
		"Qatar",
		"Romania",
		"Russia",
		"Rwanda",
		"Saint Kitts and Nevis",
		"Saint Lucia",
		"Saint Vincent",
		"Samoa",
		"San Marino",
		"Sao Tome and Principe",
		"Saudi Arabia",
		"Senegal",
		"Serbia and Montenegro",
		"Seychelles",
		"Sierra Leone",
		"Singapore",
		"Slovakia",
		"Slovenia",
		"Solomon Islands",
		"Somalia",
		"South Africa",
		"Spain",
		"Sri Lanka",
		"Sudan",
		"Suriname",
		"Swaziland",
		"Sweden",
		"Switzerland",
		"Syria",
		"Taiwan",
		"Tajikistan",
		"Tanzania",
		"Thailand",
		"Togo",
		"Tonga",
		"Trinidad and Tobago",
		"Tunisia",
		"Turkey",
		"Turkmenistan",
		"Tuvalu",
		"Uganda",
		"Ukraine",
		"United Arab Emirates",
		"United Kingdom",
		"Uruguay",
		"Uzbekistan",
		"Vanuatu",
		"Vatican City",
		"Venezuela",
		"Vietnam",
		"Yemen",
		"Zambia",
		"Zimbabwe"
	];

//	$scope.output = ['United States', 'Algeria'];
	$scope.output = [];
});

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
		templateUrl: 'ng-multiselect-template.html',
		scope: {
			data: '=data',
			output: '=output'
		},
		link: function (scope, element, attrs) {
			scope.showDebug = false;
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
