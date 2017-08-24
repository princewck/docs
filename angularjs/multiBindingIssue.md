### 问题描述

controller中，在$rootScope上使用$on监听$stateXxx一类的事件时，每次路由跳转到该controller时，都会绑定一次事件，这会导致性能浪费或潜在的bug。
[一个例子](https://codepen.io/princewck/pen/JyZVvq)

### 解决办法
1. 需要绑定的操作如果只对当前页面生效，可以考虑使用$scope.$on()代替$rootScope.$on来监听路由切换;
2. 如果需求要求必须使用rotScope, 则注意防止重复绑定
  - 在全局的run方法中绑定，以保证只在应用初始化时执行一次。
  - 可以通过类似 `$rooScope.$$listeners.$stateChangeStart`的方式访问到当前的监听列表，来初始化或清除多余绑定事件

>一个示例（可能不是最好的办法
> ```javascript
>  function stateChangeHandler() {
>    alert($stateParams.count)
>  }
>  function stateChangeDeregister() {
>    var listeners = $rootScope.$$listeners.$stateChangeStart;
>    listeners && ($rootScope.$$listeners.$stateChangeStart = listeners.filter(function (item) {
>        return item.$state !== $state.current.name;
>    }));
>  }
>
>  //注释掉这句，点击按钮时会看到$$listeners.$stateChangeStart在变多
>  stateChangeDeregister();
>
>  stateChangeHandler.$state = $state.current.name;
>  $rootScope.$on('$stateChangeStart', stateChangeHandler);
> ```

