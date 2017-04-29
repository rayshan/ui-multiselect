/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [key] {string} the name of the attribute of each object to compare for uniqueness
 if the key is empty, the entire object will be compared
 if the key === false then no filtering will be performed
 * @return {array}
 */
angular.module('ui.unique',[]).filter('unique', ['$parse', $parse => (items, filterOn) => {

  if (filterOn === false) {
    return items;
  }

  if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
    var hashCheck = {};
    var newItems = [];
    var get = angular.isString(filterOn) ? $parse(filterOn) : item => item;

    var extractValueToCompare = item => angular.isObject(item) ? get(item) : item;

    angular.forEach(items, item => {
      var valueToCheck;
      var isDuplicate = false;

      for (var i = 0; i < newItems.length; i++) {
        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) {
        newItems.push(item);
      }
    });
    items = newItems;
  }
  return items;
}]);
