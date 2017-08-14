describe('angularjs homepage test list', function () {
  var EC;
  browser.get('http://localhost:3000/angular-demo');
  beforeEach(function() {
    EC = protractor.ExpectedConditions;
  });
  it('should add 3 info', function () {
    var infos = element.all(by.repeater('info in infos'));
    expect(infos.count()).toEqual(0);

    element(by.className('get-info-btn')).click();
    var infos = element.all(by.repeater('info in infos'));
    expect(infos.count()).toEqual(3);
  });

  it('should be true', function () {
    expect(true).toBeTruthy();
  });

  it('should the title be `AngularJs单元测试`', function () {
    EC.titleIs('AngularJs单元测试');
  });

  it('should element with id abc is present', function () {
    //this should fail for no element with id abc is present
    EC.presenceOf($('#abc'));
  });

  it('should element with id cde is not present', function () {
    //this should fail for no element with id abc is present
    EC.stalenessOf($('#cde'));
  });
  
  it('element with id abc is visible on page', function () {
    EC.visibilityOf($('#abc'));
  });

  it('2nd item should be checked', function () {
    let items = element.all(by.repeater('info in infos'));
     EC.elementToBeSelected(items.get(1));// index start at 0
  });

});