describe('inflector', () => {
  var inflectorFilter;
  var testPhrase = 'here isMy_phone_number';

  beforeEach(module('ui.inflector'));
  beforeEach(inject($filter => {
    inflectorFilter = $filter('inflector');
  }));

  describe('default', () => {
    it('should default to humanize', () => {
      expect(inflectorFilter(testPhrase)).toEqual('Here Is My Phone Number');
    });
    it('should fail gracefully for invalid input', () => {
      expect(inflectorFilter(undefined)).toBeUndefined();
    });
    it('should do nothing for empty input', () => {
      expect(inflectorFilter('')).toEqual('');
    });
  });

  describe('humanize', () => {
    it('should uppercase first letter and separate words with a space', () => {
      expect(inflectorFilter(testPhrase, 'humanize')).toEqual('Here Is My Phone Number');
    });
  });
  describe('underscore', () => {
    it('should lowercase everything and separate words with an underscore', () => {
      expect(inflectorFilter(testPhrase, 'underscore')).toEqual('here_is_my_phone_number');
    });
  });
  describe('variable', () => {
    it('should remove all separators and camelHump the phrase', () => {
      expect(inflectorFilter(testPhrase, 'variable')).toEqual('hereIsMyPhoneNumber');
    });
    it('should do nothing if already formatted properly', () => {
      expect(inflectorFilter("hereIsMyPhoneNumber", 'variable')).toEqual('hereIsMyPhoneNumber');
    });
  });
});