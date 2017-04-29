describe('uiValidate', $compile => {
  var scope;
  var compileAndDigest;

  var trueValidator = () => true;

  var falseValidator = () => false;

  var passedValueValidator = valueToValidate => valueToValidate;

  beforeEach(module('ui.validate'));
  beforeEach(inject(($rootScope, $compile) => {

    scope = $rootScope.$new();
    compileAndDigest = (inputHtml, scope) => {
      var inputElm = angular.element(inputHtml);
      var formElm = angular.element('<form name="form"></form>');
      formElm.append(inputElm);
      $compile(formElm)(scope);
      scope.$digest();

      return inputElm;
    };
  }));

  describe('initial validation', () => {

    it('should mark input as valid if initial model is valid', inject(() => {

      scope.validate = trueValidator;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validate($value)\'">', scope);
      expect(scope.form.input.$valid).toBeTruthy();
      expect(scope.form.input.$error).toEqual({validator: false});
    }));

    it('should mark input as invalid if initial model is invalid', inject(() => {

      scope.validate = falseValidator;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validate($value)\'">', scope);
      expect(scope.form.input.$valid).toBeFalsy();
      expect(scope.form.input.$error).toEqual({ validator: true });
    }));
  });

  describe('validation on model change', () => {

    it('should change valid state in response to model changes', inject(() => {

      scope.value = false;
      scope.validate = passedValueValidator;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validate($value)\'">', scope);
      expect(scope.form.input.$valid).toBeFalsy();

      scope.$apply('value = true');
      expect(scope.form.input.$valid).toBeTruthy();
    }));
  });

  describe('validation on element change', () => {

    var sniffer;
    beforeEach(inject($sniffer => {
      sniffer = $sniffer;
    }));

    it('should change valid state in response to element events', () => {

      scope.value = false;
      scope.validate = passedValueValidator;
      var inputElm = compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validate($value)\'">', scope);
      expect(scope.form.input.$valid).toBeFalsy();

      inputElm.val('true');
      inputElm.trigger((sniffer.hasEvent('input') ? 'input' : 'change'));

      expect(scope.form.input.$valid).toBeTruthy();
    });
  });

  describe('multiple validators with custom keys', () => {

    it('should support multiple validators with custom keys', () => {

      scope.validate1 = trueValidator;
      scope.validate2 = falseValidator;

      compileAndDigest('<input name="input" ng-model="value" ui-validate="{key1 : \'validate1($value)\', key2 : \'validate2($value)\'}">', scope);
      expect(scope.form.input.$valid).toBeFalsy();
      expect(scope.form.input.$error.key1).toBeFalsy();
      expect(scope.form.input.$error.key2).toBeTruthy();
    });
  });

  describe('uiValidateWatch', () => {
    function validateWatch(watchMe) {
      return watchMe;
    }
    beforeEach(() => {
      scope.validateWatch = validateWatch;
    });

    it('should watch the string and refire the single validator', () => {
      scope.watchMe = false;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validateWatch(watchMe)\'" ui-validate-watch="\'watchMe\'">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.validator).toBe(true);
      scope.$apply('watchMe=true');
      expect(scope.form.input.$valid).toBe(true);
      expect(scope.form.input.$error.validator).toBe(false);
    });

    it('should watch the string and refire all validators', () => {
      scope.watchMe = false;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="{foo:\'validateWatch(watchMe)\',bar:\'validateWatch(watchMe)\'}" ui-validate-watch="\'watchMe\'">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.foo).toBe(true);
      expect(scope.form.input.$error.bar).toBe(true);
      scope.$apply('watchMe=true');
      expect(scope.form.input.$valid).toBe(true);
      expect(scope.form.input.$error.foo).toBe(false);
      expect(scope.form.input.$error.bar).toBe(false);
    });

    it('should watch the all object attributes and each respective validator', () => {
      scope.watchFoo = false;
      scope.watchBar = false;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="{foo:\'validateWatch(watchFoo)\',bar:\'validateWatch(watchBar)\'}" ui-validate-watch="{foo:\'watchFoo\',bar:\'watchBar\'}">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.foo).toBe(true);
      expect(scope.form.input.$error.bar).toBe(true);
      scope.$apply('watchFoo=true');
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.foo).toBe(false);
      expect(scope.form.input.$error.bar).toBe(true);
      scope.$apply('watchBar=true');
      scope.$apply('watchFoo=false');
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.foo).toBe(true);
      expect(scope.form.input.$error.bar).toBe(false);
      scope.$apply('watchFoo=true');
      expect(scope.form.input.$valid).toBe(true);
      expect(scope.form.input.$error.foo).toBe(false);
      expect(scope.form.input.$error.bar).toBe(false);
    });

  });

  describe('error cases', () => {
    it('should fail if ngModel not present', inject(() => {
      expect(() => {
        compileAndDigest('<input name="input" ui-validate="\'validate($value)\'">', scope);
      }).toThrow(new Error('No controller: ngModel'));
    }));
    it('should have no effect if validate expression is empty', inject(() => {
      compileAndDigest('<input ng-model="value" ui-validate="">', scope);
    }));
  });
});
