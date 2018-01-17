# 简单爬虫以及控制并发

## 目标

爬取[虎扑球员数据](https://nba.hupu.com/stats/players/pts),每个球员的场均得分和薪酬。
调用node app.js时，将以上数据以json格式输出。

## 模块

主要用到以下几个模块

1. [eventproxy](https://github.com/JacksonTian/eventproxy): http库，可发起GET/POST请求

1. [superagent](http://visionmedia.github.io/superagent/)：http库，可发起GET/POST请求

1. [cheerio](https://github.com/cheeriojs/cheerio)([社区翻译版中文api](https://cnodejs.org/topic/5203a71844e76d216a727d2e))：node版本的jquery，把dom传进去，然后jquery怎么用这个就怎么用

## 简单爬虫

思路：

1. 学习用superagent爬取网页
1. 学习用cheerio分析网页

核心代码：

```js
const superagent = require('superagent'),
      cheerio = require('cheerio'),
      targetUrl = 'https://nba.hupu.com/stats/players/pts'

superagent.get(targetUrl)
    .end((err, res) => {
        if (err) {
            return console.log(err)
        }
        let urls = []
        //页面dom在text里
        let $ = cheerio.load(res.text)
        $('.players_table .left a').each((index, element) => {
            urls.push($(element).attr('href'))
        })
        console.log(urls)
    })
```

执行后如图：![](https://raw.githubusercontent.com/dryqiao/node-lessons/master/eventproxy/1.png)

## 控制并发

当前拿到了50个球员的url，我们要发起50个请求，来获取我们所需的数据。50个请求的数据不知道哪个先完成，js处理异步，主要由标记，callback，promise等方法。callback深度嵌套是被诟病很久的问题，所以ES6出了promise方法，链式调用。EventProxy就是这样一个工具，无深度嵌套，并行。

使用EventProxy写出来是这样的，create监听了3个事件，每当一个异步请求完成，通过emit来告诉ep,当监听事件都完成以后，再调用回调函数。有点像vue里子组件向父组件传递数据，子组件通过emit触发，父组件统一监听。
组件还提供了很多场景下的API，具体去项目主页看。

```js
var ep = EventProxy.create("template", "data", "l10n", function (template, data, l10n) {
  _.render(template, data, l10n);
});

$.get("template", function (template) {
  // something
  ep.emit("template", template);
});
$.get("data", function (data) {
  // something
  ep.emit("data", data);
});
$.get("l10n", function (l10n) {
  // something
  ep.emit("l10n", l10n);
});
```

