1. 该项目技术栈：uni-app + vue3 + ts + scss + uni-ui + vk-uview-ui + tailwindcss

2. 根据图片生成页面通用规则如下

```
把图片转成成页面
页面中使用到的图片，随便找一个static目下的资源即可，不用生成
并把该页面配置追加到 pages.json里
页面布局 优先使用vk-uview-ui组件库、如果vk-uview-ui组件库没有提供对应的组件，再使用uni-ui组件库
vk-uview-ui组件地址: https://vkuviewdoc.fsq.pub/components/intro.html
css优先使用tailwindcss，但是如果vk-uview-ui组件库提供了对应的样式，优先使用vk-uview-ui组件库的样式  
布局单位:rpx
script使用 vue3 + ts语法

3. 该项目需要打包成微信小程序、h5、android、ios四个版本，实现的功能必须都要兼容这些平台
