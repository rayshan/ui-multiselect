/*global describe, beforeEach, module, inject, it, spyOn, expect, $ */
describe('uiRoute', () => {
  'use strict';

  var scope;
  var $compile;
  var $location;
  beforeEach(module('ui.route'));
  beforeEach(inject((_$rootScope_, _$compile_, _$window_, _$location_) => {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $location = _$location_;
  }));

  function setPath(path) {
    $location.path(path);
    scope.$broadcast('$routeChangeSuccess');
    scope.$apply();
  }

  function setPathWithStateChange(path) {
    $location.path(path);
    scope.$broadcast('$stateChangeSuccess');
    scope.$apply();
  }

  describe('model is null', () => {
    runTests();
  });
  describe('model is set', () => {
    runTests('pizza');
  });

  function runTests(routeModel) {
    var modelProp = routeModel || '$uiRoute';
    var elm = angular.noop;
    function compileRoute(template) {
      elm = angular.element(template);
      if (routeModel){ elm.attr('ng-model', routeModel);}
      return $compile(elm[0])(scope);
    }

    describe('with uiRoute defined', () => {
      it('should use the uiRoute property', () => {
        compileRoute('<div ui-route="/foo">');
      });
      it('should update model on $observe', () => {
        setPath('/bar');
        scope.$apply('foobar = "foo"');
        compileRoute('<div ui-route="/{{foobar}}">');
        expect(elm.scope()[modelProp]).toBeFalsy();
        scope.$apply('foobar = "bar"');
        expect(elm.scope()[modelProp]).toBe(true);
        scope.$apply('foobar = "foo"');
        expect(elm.scope()[modelProp]).toBe(false);
      });
      it('should support regular expression', () => {
        setPath('/foo/123');
        compileRoute('<div ui-route="/foo/[0-9]*">');
        expect(elm.scope()[modelProp]).toBe(true);
      });
    });

    describe('with ngHref defined', () => {

      it('should use the ngHref property', () => {
        setPath('/foo');
        compileRoute('<a ng-href="/foo" ui-route>');
        expect(elm.scope()[modelProp]).toBe(true);
      });
      it('should update model on $observe', () => {
        setPath('/bar');
        scope.$apply('foobar = "foo"');
        compileRoute('<a ng-href="/{{foobar}}" ui-route>');
        expect(elm.scope()[modelProp]).toBeFalsy();
        scope.$apply('foobar = "bar"');
        expect(elm.scope()[modelProp]).toBe(true);
        scope.$apply('foobar = "foo"');
        expect(elm.scope()[modelProp]).toBe(false);
      });
    });

    describe('with href defined', () => {

      it('should use the href property', () => {
        setPath('/foo');
        compileRoute('<a href="/foo" ui-route>');
        expect(elm.scope()[modelProp]).toBe(true);
      });
    });

    it('should throw an error if no route property available', () => {
      expect(() => {
        compileRoute('<div ui-route>');
      }).toThrow();
    });

    it('should update model on route change', () => {
      setPath('/bar');
      compileRoute('<div ui-route="/foo">');
      expect(elm.scope()[modelProp]).toBeFalsy();
      setPath('/foo');
      expect(elm.scope()[modelProp]).toBe(true);
      setPath('/bar');
      expect(elm.scope()[modelProp]).toBe(false);
    });


    it('should update model on state change', () => {
      setPathWithStateChange('/bar');
      compileRoute('<div ui-route="/foo">');
      expect(elm.scope()[modelProp]).toBeFalsy();
      setPathWithStateChange('/foo');
      expect(elm.scope()[modelProp]).toBe(true);
      setPathWithStateChange('/bar');
      expect(elm.scope()[modelProp]).toBe(false);
    });
  }
});
