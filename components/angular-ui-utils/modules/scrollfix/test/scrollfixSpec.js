/*global describe, beforeEach, module, inject, it, spyOn, expect, $ */
describe('uiScrollfix', () => {
  'use strict';

  var scope;
  var $compile;
  var $window;
  beforeEach(module('ui.scrollfix'));
  beforeEach(inject((_$rootScope_, _$compile_, _$window_) => {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $window = _$window_;
  }));

  describe('compiling this directive', () => {
    it('should bind to window "scroll" event', () => {
      spyOn($.fn, 'bind');
      $compile('<div ui-scrollfix="100"></div>')(scope);
      expect($.fn.bind).toHaveBeenCalled();
      expect($.fn.bind.mostRecentCall.args[0]).toBe('scroll');
    });
  });
  describe('scrolling the window', () => {
    it('should add the ui-scrollfix class if the offset is greater than specified', () => {
      var element = $compile('<div ui-scrollfix="-100"></div>')(scope);
      angular.element($window).trigger('scroll');
      expect(element.hasClass('ui-scrollfix')).toBe(true);
    });
    it('should remove the ui-scrollfix class if the offset is less than specified (using absolute coord)', () => {
      var element = $compile('<div ui-scrollfix="100" class="ui-scrollfix"></div>')(scope);
      angular.element($window).trigger('scroll');
      expect(element.hasClass('ui-scrollfix')).toBe(false);

    });
    it('should remove the ui-scrollfix class if the offset is less than specified (using relative coord)', () => {
      var element = $compile('<div ui-scrollfix="+100" class="ui-scrollfix"></div>')(scope);
      angular.element($window).trigger('scroll');
      expect(element.hasClass('ui-scrollfix')).toBe(false);
    });
  });
});
