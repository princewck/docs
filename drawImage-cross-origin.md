[TOC]
### CORS enabled image

HTML5中 `<img>`标签的crossOrigin属性，在canvas中使用跨域图片资源需要加上此属性，加上该属性后load该图片时会在RequestHeader中带上Origin, ResponseHeader中会带有`Access-Allow-Origin`信息。

MDN详细介绍: [https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)

> 需要服务端对请求者的`Access-Allow-Origin`支持



#### 例子

```javascript
var img = new Image,
    canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    src = "http://example.com/image"; // insert image url here

img.crossOrigin = "Anonymous";

img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage( img, 0, 0 );
    localStorage.setItem( "savedImageData", canvas.toDataURL("image/png") );
}
img.src = src;
// make sure the load event fires for cached images too
if ( img.complete || img.complete === undefined ) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
}
```



#### 遇到的问题

上面例子中 `src="http://example.com/image"`这张图片如果当前页面之前加载过，上述代码会出现问题，浏览器默认会去缓存中取之前的请求结果，如果之前的请求中该Image对象没有crossOrigin属性，此时crossOrigin属性会失效，也就是请求结果中不存在`Access-Allow-Origin`头，此时如果走下面的代码，用于canvan中drawImage会出现跨域错误。



#### 解决办法

上述情况下用于canvas中的图不从缓存中取，想办法绕过缓存数据。


> 相关资料:
>
> [https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
>
> [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-crossorigin)


#### Tips
在html中使用crossOrigin
```html
<img src="xxx.img.jpg" crossorign="anonymous" />
```