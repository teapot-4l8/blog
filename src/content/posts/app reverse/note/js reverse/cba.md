---
tittle: 中国男子篮球职业联赛官网名单数据爬取
published: 2025-01-25
category: 网页爬虫
tags: [Python, Javascript, AES, js2py]
draft: false
description: 球队详情-基础资料 返回数据解密
---

https://www.cbaleague.com/data/#/teamMain?teamId=29136

api: https://data-server.cbaleague.com/api/teams/29136/seasons/2024/players

![image-20250125192353467](cba.assets/image-20250125192353467.png)

观察控制台发现bro直接在console里打印了解密后的数据...

![image-20250125193023805](cba.assets/image-20250125193023805.png)

可知在此函数之前数据已经解密

或从调用栈Promise.then之后的函数中进去

![image-20250125195551487](cba.assets/image-20250125195551487.png)

![image-20250125195708032](cba.assets/image-20250125195708032.png)

多次下断点

![image-20250125200747921](cba.assets/image-20250125200747921.png)

利用a下条件断点，断到我们需要的那个url

![image-20250125200948695](cba.assets/image-20250125200948695.png)

```javascript
a.config.url.indexOf("players") ！= -1
```

继续往后走，找到解密函数

![image-20250125201103560](cba.assets/image-20250125201103560.png)

![image-20250125201347616](cba.assets/image-20250125201347616.png)