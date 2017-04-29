describe('uiMask', () => {
  var formHtml  = "<form name='test'><input name='input' ng-model='x' ui-mask='{{mask}}'></form>";
  var inputHtml = "<input name='input' ng-model='x' ui-mask='{{mask}}'>";
  var compileElement;
  var scope;
  var config;

  beforeEach(module('ui.mask'));
  beforeEach(inject(($rootScope, $compile, uiMaskConfig) => {
    c = console.log;
    scope = $rootScope; 
    config = uiMaskConfig;
    compileElement = html => $compile(html)(scope);
  }));

  describe('initialization', () => {

    it("should not not happen if the mask is undefined or invalid", () => {
      var input = compileElement(inputHtml);
      scope.$apply("x = 'abc123'");
      expect(input.val()).toBe('abc123');
      scope.$apply("mask = '()_abc123'");
      expect(input.val()).toBe('abc123');
    });

    it("should mask the value only if it's valid", () => {
      var input = compileElement(inputHtml);
      scope.$apply("x = 'abc123'");
      scope.$apply("mask = '(A) * 9'");
      expect(input.val()).toBe('(a) b 1');
      scope.$apply("mask = '(A) * 9 A'");
      expect(input.val()).toBe('');
    });

    it("should not dirty or invalidate the input", () => {
      var input = compileElement(inputHtml);
      scope.$apply("x = 'abc123'");
      scope.$apply("mask = '(9) * A'");
      expect(input.hasClass('ng-pristine ng-valid')).toBeTruthy();
      scope.$apply("mask = '(9) * A 9'");
      expect(input.hasClass('ng-pristine ng-valid')).toBeTruthy();
    });

    it("should not change the model value", () => {
      var input = compileElement(inputHtml);
      scope.$apply("x = 'abc123'");
      scope.$apply("mask = '(A) * 9'");
      expect(scope.x).toBe('abc123');
      scope.$apply("mask = '(A) * 9 A'");
      expect(scope.x).toBe('abc123');
    });

    it("should set ngModelController.$viewValue to match input value", () => {
      var form  = compileElement(formHtml);
      var input = form.find('input');
      scope.$apply("x = 'abc123'");
      scope.$apply("mask = '(A) * 9'");
      expect(scope.test.input.$viewValue).toBe('(a) b 1');
      scope.$apply("mask = '(A) * 9 A'");
      expect(scope.test.input.$viewValue).toBe('');
    });

  });

  describe('user input', () => {
    it("should mask-as-you-type", () => {
      var form  = compileElement(formHtml);
      var input = form.find('input');
      scope.$apply("x = ''");
      scope.$apply("mask = '(A) * 9'");
      input.val('a').triggerHandler('input');
      expect(input.val()).toBe('(a) _ _');
      input.val('ab').triggerHandler('input');
      expect(input.val()).toBe('(a) b _');
      input.val('ab1').triggerHandler('input');
      expect(input.val()).toBe('(a) b 1');
    });

    it("should set ngModelController.$viewValue to match input value", () => {
      var form  = compileElement(formHtml);
      var input = form.find('input');
      scope.$apply("x = ''");
      scope.$apply("mask = '(A) * 9'");
      input.val('a').triggerHandler('input');
      input.triggerHandler('change'); // Because IE8 and below are terrible
      expect(scope.test.input.$viewValue).toBe('(a) _ _');
    });

    it("should parse unmasked value to model", () => {
      var form  = compileElement(formHtml);
      var input = form.find('input');
      scope.$apply("x = ''");
      scope.$apply("mask = '(A) * 9'");
      input.val('abc123').triggerHandler('input');
      input.triggerHandler('change'); // Because IE8 and below are terrible
      expect(scope.x).toBe('ab1');
    });

    it("should set model to undefined if masked value is invalid", () => {
      var form  = compileElement(formHtml);
      var input = form.find('input');
      scope.$apply("x = ''");
      scope.$apply("mask = '(A) * 9'");
      input.val('a').triggerHandler('input');
      input.triggerHandler('change'); // Because IE8 and below are terrible
      expect(scope.x).toBeUndefined();
    });
    
    it("should not set model to an empty mask", () => {
      var form  = compileElement(formHtml);
      var input = form.find('input');
      scope.$apply("x = ''");
      scope.$apply("mask = '(A) * 9'");
      input.triggerHandler('input');
      expect(scope.x).toBe('');
    });
  });

  describe('changes from the model', () => {
    it("should set the correct ngModelController.$viewValue", () => {
      var form  = compileElement(formHtml);
      var input = form.find('input');
      scope.$apply("mask = '(A) * 9'");
      scope.$apply("x = ''");
      expect(scope.test.input.$viewValue).not.toBeDefined();
      scope.$apply("x = 'abc'");
      expect(scope.test.input.$viewValue).not.toBeDefined();
      scope.$apply("x = 'abc123'");
      expect(scope.test.input.$viewValue).toBe('(a) b 1');
    });
  });

  describe('default mask definitions', () => {
    it("should accept optional mask after '?'", () => {
      var input = compileElement(inputHtml);

      scope.$apply("x = ''");
      scope.$apply("mask = '**?9'");

      input.val('aa').triggerHandler('input');
      input.triggerHandler('blur');
      expect(input.val()).toBe('aa_');

      input.val('99a').triggerHandler('input');
      input.triggerHandler('blur');
      expect(input.val()).toBe('99_');

      input.val('992').triggerHandler('input');
      input.triggerHandler('blur');
      expect(input.val()).toBe('992');
    });
  });

  describe('configuration', () => {
    it("should accept the new mask definition set globally", () => {
      config.maskDefinitions['@'] = /[fz]/;
      
      var input = compileElement(inputHtml);
      
      scope.$apply("x = ''");
      scope.$apply("mask = '@193'"); 
      input.val('f123').triggerHandler('input');
      input.triggerHandler('blur');
      expect(input.val()).toBe('f123');
    });
    
    it("should accept the new mask definition set per element", () => {
      delete config.maskDefinitions['@'];

      scope.input = {
        options: {maskDefinitions: {'@': /[fz]/}}
      };
      
      var input = compileElement('<input type="text" ng-model="x" ui-mask="{{mask}}" ui-options="input.options">');
      scope.$apply("x = ''");
      scope.$apply("mask = '@999'");
      input.val('f111').triggerHandler('input');
      input.triggerHandler('blur');
      expect(input.val()).toBe('f111');
    });
  });

  describe('blurring', () => {
    it("should clear an invalid value from the input", () => {
      var input = compileElement(inputHtml);
      scope.$apply("x = ''");
      scope.$apply("mask = '(9) * A'");
      input.val('a').triggerHandler('input');
      input.triggerHandler('blur');
      expect(input.val()).toBe('');
    });

    it("should clear an invalid value from the ngModelController.$viewValue", () => {
      var form  = compileElement(formHtml);
      var input = form.find('input');
      scope.$apply("x = ''");
      scope.$apply("mask = '(A) * 9'");
      input.val('a').triggerHandler('input');
      input.triggerHandler('blur');
      expect(scope.test.input.$viewValue).toBe('');
    });
  });
});