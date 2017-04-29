describe('unique', () => {
  var uniqueFilter;

  beforeEach(module('ui.unique'));
  beforeEach(inject($filter => {
    uniqueFilter = $filter('unique');
  }));

  it('should return unique entries based on object equality', () => {
    var arrayToFilter = [
      {key: 'value'},
      {key: 'value2'},
      {key: 'value'}
    ];
    expect(uniqueFilter(arrayToFilter)).toEqual([
      {key: 'value'},
      {key: 'value2'}
    ]);
  });

  it('should return unique entries based on object equality for complex objects', () => {
    var arrayToFilter = [
      {key: 'value', other: 'other1'},
      {key: 'value2', other: 'other2'},
      {other: 'other1', key: 'value'}
    ];
    expect(uniqueFilter(arrayToFilter)).toEqual([
      {key: 'value', other: 'other1'},
      {key: 'value2', other: 'other2'}
    ]);
  });

  it('should return unique entries based on the key provided', () => {
    var arrayToFilter = [
      {key: 'value'},
      {key: 'value2'},
      {key: 'value'}
    ];
    expect(uniqueFilter(arrayToFilter, 'key')).toEqual([
      {key: 'value'},
      {key: 'value2'}
    ]);
  });

  it('should return unique entries based on the key provided for complex objects', () => {
    var arrayToFilter = [
      {key: 'value', other: 'other1'},
      {key: 'value2', other: 'other2'},
      {key: 'value', other: 'other3'}
    ];
    expect(uniqueFilter(arrayToFilter, 'key')).toEqual([
      { key: 'value', other: 'other1' },
      { key: 'value2', other: 'other2' }
    ]);
  });

  it('should return unique entries based on the subkey provided for complex objects', () => {
    var arrayToFilter = [
      {key: 'value', other: {subkey: 'sub1'}},
      {key: 'value', other: {subkey: 'sub2'}},
      {key: 'value2', other: {subkey: 'sub1'}}
    ];
    expect(uniqueFilter(arrayToFilter, 'other.subkey')).toEqual([
      {key: 'value', other: {subkey: 'sub1'}},
      {key: 'value', other: {subkey: 'sub2'}}
    ]);
  });

  it('should return unique primitives in arrays', () => {
    expect(uniqueFilter([1, 2, 1, 3])).toEqual([1, 2, 3]);
  });

  it('should work correctly for arrays of mixed elements and object equality', () => {
    expect(uniqueFilter([1, {key: 'value'}, 1, {key: 'value'}, 2, "string", 3])).toEqual([1, {key: 'value'}, 2, "string", 3]);
  });

  it('should work correctly for arrays of mixed elements and a key specified', () => {
    expect(uniqueFilter([1, {key: 'value'}, 1, {key: 'value'}, 2, "string", 3], 'key')).toEqual([1, {key: 'value'}, 2, "string", 3]);
  });

  it('should return unmodified object if not array', () => {
    expect(uniqueFilter('string', 'someKey')).toEqual('string');
  });

  it('should return unmodified array if provided key === false', () => {
    var arrayToFilter = [
      {key: 'value1'},
      {key: 'value2'}
    ];
    expect(uniqueFilter(arrayToFilter, false)).toEqual(arrayToFilter);
  });

});