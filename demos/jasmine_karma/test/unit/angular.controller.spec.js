'use strict';
describe('测试angularJs controller', function () {
  describe('test testCtrl', function () {
    beforeEach(module('app'));

    var scope, ctrl, $compile;
    beforeEach(inject(function ($controller, $rootScope, _$compile_) {
      scope = $rootScope.$new();
      ctrl = $controller('testCtrl', {$scope: scope});
      $compile = _$compile_;
    }));

    it('should page title `This is the page title!` in testCtrl', function () {
      inject(function () {
        expect(scope.pageTitle).toEqual('This is the page title!');
      });
    });

    it('test page contain pageTitle', function () {
      var element = $compile('<div><h1 ng-bind="pageTitle"></h1></div>')(scope);
      scope.$digest();
      expect(element.html()).toContain('This is the page title!');
    });
  });
});
