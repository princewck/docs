describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    browser.get('http://localhost:3000/angular-demo');

    var infos = element.all(by.repeater('info in infos'));
    expect(infos.count()).toEqual(0);

    element(by.className('get-info-btn')).click();
    var infos = element.all(by.repeater('info in infos'));
    expect(infos.count()).toEqual(3);
  });
});