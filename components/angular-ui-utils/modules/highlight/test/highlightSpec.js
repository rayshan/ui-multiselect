describe('highlight', () => {
  var highlightFilter;
  var testPhrase = 'Prefix Highlight Suffix';

  beforeEach(module('ui.highlight'));
  beforeEach(inject($filter => {
    highlightFilter = $filter('highlight');
  }));
  describe('case insensitive', () => {
    it('should highlight a matching phrase', () => {
      expect(highlightFilter(testPhrase, 'highlight')).toEqual('Prefix <span class="ui-match">Highlight</span> Suffix');
    });
    it('should highlight nothing if no match found', () => {
      expect(highlightFilter(testPhrase, 'no match')).toEqual(testPhrase);
    });
    it('should highlight nothing for the undefined filter', () => {
      expect(highlightFilter(testPhrase, undefined)).toEqual(testPhrase);
    });
    it('should work correctly for number filters', () => {
      expect(highlightFilter('3210123', 0)).toEqual('321<span class="ui-match">0</span>123');
    });
    it('should work correctly for number text', () => {
      expect(highlightFilter(3210123, '0')).toEqual('321<span class="ui-match">0</span>123');
    });
  });
  describe('case sensitive', () => {
    it('should highlight a matching phrase', () => {
      expect(highlightFilter(testPhrase, 'Highlight', true)).toEqual('Prefix <span class="ui-match">Highlight</span> Suffix');
    });
    it('should highlight nothing if no match found', () => {
      expect(highlightFilter(testPhrase, 'no match', true)).toEqual(testPhrase);
    });
    it('should highlight nothing for the undefined filter', () => {
      expect(highlightFilter(testPhrase, undefined, true)).toEqual(testPhrase);
    });
    it('should work correctly for number filters', () => {
      expect(highlightFilter('3210123', 0, true)).toEqual('321<span class="ui-match">0</span>123');
    });
    it('should work correctly for number text', () => {
      expect(highlightFilter(3210123, '0', true)).toEqual('321<span class="ui-match">0</span>123');
    });
    it('should not highlight a phrase with different letter-casing', () => {
      expect(highlightFilter(testPhrase, 'highlight', true)).toEqual(testPhrase);
    });
  });
  it('should highlight nothing if empty filter string passed - issue #114', () => {
    expect(highlightFilter(testPhrase, '')).toEqual(testPhrase);
  });
});