describe('uiEvent', () => {
  var $scope;
  var $rootScope;
  var $compile;

  beforeEach(module('ui.event'));
  beforeEach(inject((_$rootScope_, _$compile_) => {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  //helper for creating event elements
  function eventElement(scope, eventObject) {
    scope._uiEvent = eventObject || {};
    return $compile('<span ui-event="_uiEvent">')(scope);
  }

  describe('test', () => {
    it('should work with dblclick event and assignment', () => {
      $scope = $rootScope.$new();
      var elm = eventElement($scope, {'dblclick': 'dbl=true'});
      expect($scope.dbl).toBeUndefined();
      elm.triggerHandler('dblclick');
      expect($scope.dbl).toBe(true);
    });

    it('should work with two events in one key a function', () => {
      $scope = $rootScope.$new();
      $scope.counter = 0;
      $scope.myfn = () => {
        $scope.counter++;
      };
      var elm = eventElement($scope, {'keyup mouseenter': 'myfn()'});
      elm.triggerHandler('keyup');
      elm.triggerHandler('mouseenter');
      expect($scope.counter).toBe(2);
    });

    it('should work work with multiple entries', () => {
      $scope = $rootScope.$new();
      $scope.amount = 5;
      var elm = eventElement($scope, {
        'click': 'amount=amount*2',
        'mouseenter': 'amount=amount*4',
        'keyup': 'amount=amount*3'
      });
      elm.triggerHandler('click');
      expect($scope.amount).toBe(10);
      elm.triggerHandler('mouseenter');
      expect($scope.amount).toBe(40);
      elm.triggerHandler('keyup');
      expect($scope.amount).toBe(120);
    });

    it('should allow passing of $event object', () => {
      $scope = $rootScope.$new();
      $scope.clicky = (par1, $event, par2) => {
        expect($event.foo).toBe('bar');
        expect(par1).toBe(1);
        expect(par2).toBe(2);
      };
      var elm = eventElement($scope, {'click': 'clicky(1, $event, 2)'});
      elm.triggerHandler({
        type: 'click',
        foo: 'bar'
      });
    });

    it('should allow passing of $params object', () => {
      $scope = $rootScope.$new();
      $scope.onStuff = ($event, $params) => {
        expect($event.type).toBe('stuff');
        expect($params[0]).toBe('foo');
        expect($params[1]).toBe('bar');
      };
      var elm = eventElement($scope, {'stuff': 'onStuff($event, $params)'});
      elm.triggerHandler('stuff', ['foo', 'bar']);
    });
  });
});