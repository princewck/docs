describe('Test if reverse string function work', function () {
  it('should be true', function () {
    expect(true).toBe(true);
  });

  it('should reverse work', function () {
    expect(reverseString('hello')).toBe('olleh');
  });

  xit('shoule reverse null not valid', function () {
    expect(reverseString(null)).toBeNull;
  });
});