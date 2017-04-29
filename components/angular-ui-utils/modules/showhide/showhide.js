/**
 * uiShow Directive
 *
 * Adds a 'ui-show' class to the element instead of display:block
 * Created to allow tighter control  of CSS without bulkier directives
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
angular.module('ui.showhide',[])
.directive('uiShow', [() => (scope, elm, attrs) => {
  scope.$watch(attrs.uiShow, (newVal, oldVal) => {
    if (newVal) {
      elm.addClass('ui-show');
    } else {
      elm.removeClass('ui-show');
    }
  });
}])

/**
 * uiHide Directive
 *
 * Adds a 'ui-hide' class to the element instead of display:block
 * Created to allow tighter control  of CSS without bulkier directives
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
.directive('uiHide', [() => (scope, elm, attrs) => {
  scope.$watch(attrs.uiHide, (newVal, oldVal) => {
    if (newVal) {
      elm.addClass('ui-hide');
    } else {
      elm.removeClass('ui-hide');
    }
  });
}])

/**
 * uiToggle Directive
 *
 * Adds a class 'ui-show' if true, and a 'ui-hide' if false to the element instead of display:block/display:none
 * Created to allow tighter control  of CSS without bulkier directives. This also allows you to override the
 * default visibility of the element using either class.
 *
 * @param expression {boolean} evaluated expression to determine if the class should be added
 */
.directive('uiToggle', [() => (scope, elm, attrs) => {
  scope.$watch(attrs.uiToggle, (newVal, oldVal) => {
    if (newVal) {
      elm.removeClass('ui-hide').addClass('ui-show');
    } else {
      elm.removeClass('ui-show').addClass('ui-hide');
    }
  });
}]);
