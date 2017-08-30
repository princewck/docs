# rootScope.js 源码拾遗

## $new
> Scope.prototype.$new
```javascript
function(isolate, parent) {
  var child;

  parent = parent || this;

  if (isolate) {
    child = new Scope();
    child.$root = this.$root;
  } else {
    // Only create a child scope class if somebody asks for one,
    // but cache it to allow the VM to optimize lookups.
    if (!this.$$ChildScope) {
      this.$$ChildScope = createChildScopeClass(this);
    }
    child = new this.$$ChildScope();
  }
  child.$parent = parent;
  child.$$prevSibling = parent.$$childTail;
  if (parent.$$childHead) {
    parent.$$childTail.$$nextSibling = child;
    parent.$$childTail = child;
  } else {
    parent.$$childHead = parent.$$childTail = child;
  }

  // When the new scope is not isolated or we inherit from `this`, and
  // the parent scope is destroyed, the property `$$destroyed` is inherited
  // prototypically. In all other cases, this property needs to be set
  // when the parent scope is destroyed.
  // The listener needs to be added after the parent is set
  if (isolate || parent !== this) child.$on('$destroy', destroyChildScope);

  return child;
}

function createChildScopeClass(parent) {
  function ChildScope() {
    this.$$watchers = this.$$nextSibling =
        this.$$childHead = this.$$childTail = null;
    this.$$listeners = {};
    this.$$listenerCount = {};
    this.$$watchersCount = 0;
    this.$id = nextUid();
    this.$$ChildScope = null;
  }
  ChildScope.prototype = parent;
  return ChildScope;
}
```
- 一般不需要手动调用$new, 在封装一些插件和库时可能会用到。
- isolate参数不传递的话默认是创建了当前scope的子scope, 从createChildScopeClass的实现可以发现，scope之间的嵌套盒继承关系是基于原型链的。


## $watch：
> Scope.prototype.$watch
### 参数
- `watchExpression`：可以是string，对应scope上的属性；也可以是function
- `listener`：变化时的回调
- `objectEquality` = false：是否使用angular.equals来做深层比较，默认引用类型值只是比较引用是否相等，如同一个数组里面值的增减不会触发change。
- `prettyPrintExpression`: watcher的exp字段名称，文档中未提及，可能是为了方便调试，可以在$scope.$$watchers数组中没个对象上看到exp字段，默认是`watchExpression`的值。
### 返回值
返回监听事件的销毁函数。

### 技巧
- `listener`除了在被watch的值发生变化时调用，在初始化时也会调用一次，在这种情况下回调中的值oldVal会等于newVal, 如果这里的操作是不必要的且耗资源的，可以通过 newVal === oldVal 比较来确定是否执行操作。

### $watchGroup
> Scope.prototype.$watchGroup
$watch 的变体，同时监听一组参数。但是只有前两个参数，不支持objectEquality参数。在只需要知道一组表达式的值变化，无需关注到底是谁变了的情况下使用。
- 不能用newVal和oldVal的值来确定到底是哪个值变化，因为两个数组中每一项是表达式纬度的新旧址，并不是前后两次回调调用时的值。
> 官方的例子：
```javascript
  $scope.$watchGroup(['v1', 'v2'], function(newValues, oldValues) {
    console.log(newValues, oldValues);
  });

  // newValues, oldValues initially
  // [undefined, undefined], [undefined, undefined]

  $scope.v1 = 'a';
  $scope.v2 = 'a';

  // ['a', 'a'], [undefined, undefined]

  $scope.v2 = 'b'

  // v1 hasn't changed since it became `'a'`, therefore its oldValue is still `undefined`
  // ['a', 'b'], [undefined, 'a']
```
