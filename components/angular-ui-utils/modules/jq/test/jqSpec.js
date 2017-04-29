describe('uiJq', () => {
  var scope;
  var compile;
  var timeout;
  scope = null;
  beforeEach(module('ui.jq'));
  beforeEach(() => {
    jQuery.fn.foo = () => {};
    module($provide => {
      $provide.value('ui.config', {
        jq: {foo: {}}
      });
    });
  });
  beforeEach(inject(($rootScope, $compile, $timeout) => {
    scope = $rootScope.$new();
    compile = $compile;
    timeout = $timeout;
  }));
  describe('function or plugin isn\'t found', () => {
    it('should throw an error', () => {
      expect(() => {
        compile("<div ui-jq='failure'></div>")(scope);
      }).toThrow();
    });
  });
  describe('calling a jQuery element function', () => {
    it('should just like, sort of work and junk', () => {
      spyOn(jQuery.fn, 'foo');
      compile("<div ui-jq='foo'></div>")(scope);
      timeout.flush();
      expect(jQuery.fn.foo).toHaveBeenCalled();
    });
    it('should fire after the view has rendered', () => {
      var length;
      jQuery.fn.bar = function() {
        length = angular.element(this).children().length;
//        console.log(length);
      };
      scope.$apply('items=[1, 2]');
      compile("<ul ui-jq='bar'><li ng-repeat='item in items'></li></ul>")(scope);
      scope.$apply();
      timeout.flush();
      expect(length).toBe(2);
    });
  });
  describe('calling a jQuery element function with options', () => {
    it('should not copy options.pizza to global', () => {
      spyOn(jQuery.fn, 'foo');
      compile('<div ui-jq="foo" ui-options="{pizza:true}"></div><div ui-jq="foo" ui-options="{}"></div>')(scope);
      timeout.flush();
      expect(jQuery.fn.foo.calls[0].args).toEqual([{pizza: true}]);
      expect(jQuery.fn.foo.calls[1].args).toEqual([{}]);
    });
  });
  describe('using ui-refresh', () => {
    it('should execute exactly once if the expression is never set', () => {
      spyOn(jQuery.fn, 'foo');
      compile('<div ui-jq="foo" ui-refresh="bar"></div>')(scope);
      timeout.flush();
      expect(jQuery.fn.foo.callCount).toBe(1);
    });
    it('should execute exactly once if the expression is set at initialization', () => {
      spyOn(jQuery.fn, 'foo');
      scope.$apply('bar = true');
      compile('<div ui-jq="foo" ui-refresh="bar"></div>')(scope);
      timeout.flush();
      expect(jQuery.fn.foo.callCount).toBe(1);
    });
    it('should execute once for each time the expression changes', () => {
      spyOn(jQuery.fn, 'foo');
      scope.$apply('bar = 1');
      compile('<div ui-jq="foo" ui-refresh="bar"></div>')(scope);
      timeout.flush();
      expect(jQuery.fn.foo.callCount).toBe(1);
      scope.$apply('bar = bar+1');
      timeout.flush();
      expect(jQuery.fn.foo.callCount).toBe(2);
      scope.$apply('bar = bar+1');
      timeout.flush();
      expect(jQuery.fn.foo.callCount).toBe(3);
    });
  });
  describe('change events', () => {
    it('should trigger an `input` event', () => {
      var bar = false;
      var element = compile('<input ui-jq="foo" ng-model="foobar">')(scope);
      element.bind('input', () => {
        bar = true;
      });
      element.trigger('change');
      expect(bar).toBe(true);
    });
    it('should ignore controls without ngModel attribute', () => {
      var bar = false;
      var element = compile('<input ui-jq="foo">')(scope);
      element.bind('input', () => {
        bar = true;
      });
      element.trigger('change');
      expect(bar).toBe(false);
    });
    it('should ignore non-form controls', () => {
      var bar = false;
      var element = compile('<div ui-jq="foo"></div  ng-model="foobar">')(scope);
      element.bind('input', () => {
        bar = true;
      });
      element.trigger('change');
      expect(bar).toBe(false);
    });
  });
});
