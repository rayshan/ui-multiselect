/*global beforeEach, describe, it, inject, expect, module, spyOn*/

((() => {
    'use strict';

    describe('uiShow', () => {
        var scope;
        var $compile;
        beforeEach(module('ui.showhide'));
        beforeEach(inject((_$rootScope_, _$compile_) => {
            scope = _$rootScope_.$new();
            $compile = _$compile_;
        }));

        describe('linking the directive', () => {
            it('should call scope.$watch', () => {
                spyOn(scope, '$watch');
                $compile('<div ui-show="foo"></div>')(scope);
                expect(scope.$watch).toHaveBeenCalled();
            });
        });

        describe('executing the watcher', () => {
            it('should add the ui-show class if true', () => {
                var element = $compile('<div ui-show="foo"></div>')(scope);
                scope.foo = true;
                scope.$apply();
                expect(element.hasClass('ui-show')).toBe(true);
            });
            it('should remove the ui-show class if false', () => {
                var element = $compile('<div ui-show="foo"></div>')(scope);
                scope.foo = false;
                scope.$apply();
                expect(element.hasClass('ui-show')).toBe(false);
            });
        });
    });

    describe('uiHide', () => {
        var scope;
        var $compile;
        beforeEach(module('ui.showhide'));
        beforeEach(inject((_$rootScope_, _$compile_) => {
            scope = _$rootScope_.$new();
            $compile = _$compile_;
        }));

        describe('when the directive is linked', () => {
            it('should call scope.$watch', () => {
                spyOn(scope, '$watch');
                $compile('<div ui-hide="foo"></div>')(scope);
                expect(scope.$watch).toHaveBeenCalled();
            });
        });

        describe('executing the watcher', () => {
            it('should add the ui-hide class if true', () => {
                var element = $compile('<div ui-hide="foo"></div>')(scope);
                scope.foo = true;
                scope.$apply();
                expect(element.hasClass('ui-hide')).toBe(true);
            });
            it('should remove the ui-hide class if false', () => {
                var element = $compile('<div ui-hide="foo"></div>')(scope);
                scope.foo = false;
                scope.$apply();
                expect(element.hasClass('ui-hide')).toBe(false);
            });
        });
    });

    describe('uiToggle', () => {
        var scope;
        var $compile;
        beforeEach(module('ui.showhide'));
        beforeEach(inject((_$rootScope_, _$compile_) => {
            scope = _$rootScope_.$new();
            $compile = _$compile_;
        }));

        describe('when the directive is linked', () => {
            it('should call scope.$watch', () => {
                spyOn(scope, '$watch');
                $compile('<div ui-toggle="foo"></div>')(scope);
                expect(scope.$watch).toHaveBeenCalled();
            });
        });

        describe('executing the watcher', () => {
            it('should remove the ui-hide class and add the ui-show class if true', () => {
                var element = $compile('<div ui-toggle="foo"></div>')(scope);
                scope.foo = true;
                scope.$apply();
                expect(element.hasClass('ui-show') && !element.hasClass('ui-hide')).toBe(true);
            });
            it('should remove the ui-hide class and add the ui-show class if false', () => {
                var element = $compile('<div ui-toggle="foo"></div>')(scope);
                scope.foo = false;
                scope.$apply();
                expect(!element.hasClass('ui-show') && element.hasClass('ui-hide')).toBe(true);
            });
        });
    });
}))();
