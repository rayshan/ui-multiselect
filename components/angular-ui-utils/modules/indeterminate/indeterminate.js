/**
 * Provides an easy way to toggle a checkboxes indeterminate property
 *
 * @example <input type="checkbox" ui-indeterminate="isUnkown">
 */
angular.module('ui.indeterminate',[]).directive('uiIndeterminate', [
  () => ({
    compile(tElm, tAttrs) {
      if (!tAttrs.type || tAttrs.type.toLowerCase() !== 'checkbox') {
        return angular.noop;
      }

      return ($scope, elm, attrs) => {
        $scope.$watch(attrs.uiIndeterminate, (newVal, oldVal) => {
          elm[0].indeterminate = !!newVal;
        });
      };
    }
  })]);
