/**
 * General-purpose validator for ngModel.
 * angular.js comes with several built-in validation mechanism for input fields (ngRequired, ngPattern etc.) but using
 * an arbitrary validation function requires creation of a custom formatters and / or parsers.
 * The ui-validate directive makes it easy to use any function(s) defined in scope as a validator function(s).
 * A validator function will trigger validation on both model and input changes.
 *
 * @example <input ui-validate=" 'myValidatorFunction($value)' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }">
 * @example <input ui-validate="{ foo : '$value > anotherModel' }" ui-validate-watch=" 'anotherModel' ">
 * @example <input ui-validate="{ foo : '$value > anotherModel', bar : 'validateFoo($value)' }" ui-validate-watch=" { foo : 'anotherModel' } ">
 *
 * @param ui-validate {string|object literal} If strings is passed it should be a scope's function to be used as a validator.
 * If an object literal is passed a key denotes a validation error key while a value should be a validator function.
 * In both cases validator function should take a value to validate as its argument and should return true/false indicating a validation result.
 */
angular.module('ui.validate',[]).directive('uiValidate', () => ({
  restrict: 'A',
  require: 'ngModel',

  link(scope, elm, attrs, ctrl) {
    var validateFn;
    var watch;
    var validators = {};
    var validateExpr = scope.$eval(attrs.uiValidate);

    if (!validateExpr){ return;}

    if (angular.isString(validateExpr)) {
      validateExpr = { validator: validateExpr };
    }

    angular.forEach(validateExpr, (exprssn, key) => {
      validateFn = valueToValidate => {
        var expression = scope.$eval(exprssn, { '$value' : valueToValidate });
        if (angular.isObject(expression) && angular.isFunction(expression.then)) {
          // expression is a promise
          expression.then(() => {
            ctrl.$setValidity(key, true);
          }, () => {
            ctrl.$setValidity(key, false);
          });
          return valueToValidate;
        } else if (expression) {
          // expression is true
          ctrl.$setValidity(key, true);
          return valueToValidate;
        } else {
          // expression is false
          ctrl.$setValidity(key, false);
          return undefined;
        }
      };
      validators[key] = validateFn;
      ctrl.$formatters.push(validateFn);
      ctrl.$parsers.push(validateFn);
    });

    // Support for ui-validate-watch
    if (attrs.uiValidateWatch) {
      watch = scope.$eval(attrs.uiValidateWatch);
      if (angular.isString(watch)) {
        scope.$watch(watch, () => {
          angular.forEach(validators, (validatorFn, key) => {
            validatorFn(ctrl.$modelValue);
          });
        });
      } else {
        angular.forEach(watch, (expression, key) => {
          scope.$watch(expression, () => {
            validators[key](ctrl.$modelValue);
          });
        });
      }
    }
  }
}));
