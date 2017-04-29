describe('uiIndeterminate', () => {
  var $scope;
  var $compile;

  beforeEach(module('ui.indeterminate'));
  beforeEach(inject((_$rootScope_, _$compile_) => {
    $compile = _$compile_;
    $scope = _$rootScope_.$new();
  }));

  it('should watch ui-indeterminate and toggle the indeterminate property', () => {
    elm = $compile('<input type="checkbox" ui-indeterminate="isUnknown" />')($scope);
    expect(elm[0].indeterminate).toBeFalsy();
    $scope.isUnknown = true;
    $scope.$apply();
    expect(elm[0].indeterminate).toBe(true);
    $scope.isUnknown = false;
    $scope.$apply();
    expect(elm[0].indeterminate).toBe(false);
  });

  it('should do nothing if not attached to input[type=checkbox]', () => {
    elm = $compile('<input ui-indeterminate="isUnknown" />')($scope);
    expect(elm[0].indeterminate).toBeFalsy();
    $scope.isUnknown = true;
    $scope.$apply();
    expect(elm[0].indeterminate).toBeFalsy();
    $scope.isUnknown = false;
    $scope.$apply();
    expect(elm[0].indeterminate).toBeFalsy();
  });
});