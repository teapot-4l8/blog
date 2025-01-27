---
title: 全国招标公告公示搜索引擎数据解密
published: 2024-01-23
description: DES解密, crypto byte还原为字符串写法
tags: [Javascript, Python, DES, js逆向]
category: 网页爬虫
draft: false
---

*http://ctbpsp.com/#/*


![image-20250123135021409](ctbpsp招标.assets/image-20250123135021409.png)

点击翻页，这是目标

看到 `Promise.then` 优先搜索 `interceptors` 搜不到再搜别的

![image-20250123141511932](ctbpsp招标.assets/image-20250123141511932.png)

这个是axios的源码，不看这里，继续点进下一个搜索结果![image-20250123151338103](ctbpsp招标.assets/image-20250123151338103.png)

因为是请求返回的结果，所以在这里打断点

![image-20250123141657869](ctbpsp招标.assets/image-20250123141657869.png)

找到解密函数

![image-20250123141839746](ctbpsp招标.assets/image-20250123141839746.png)

![image-20250123141930815](ctbpsp招标.assets/image-20250123141930815.png)

```python
des=DES.new(key=b'1qaz@wsx',mode=DES.MODE_ECB)  # DES 的 key是8位，但是js里的多了两个，所以把它删掉
bs=base64.b64decode(data)
ss=des.decrypt(bs).decode('utf-8')
print(ss)
```

```javascript
var CryptoJS = require("crypto-js");

function Y(e) {
    var t = CryptoJS.enc.Utf8.parse("1qaz@wsx3e")
      , i = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(e)
    }, t, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return i.toString(CryptoJS.enc.Utf8) // i是crypto封装的字节
    // i.toString() 可能是十六进制字符串，也有可能是Base64
}
data = "密文..."
console.log(Y(data))
```

![image-20250123144404697](ctbpsp招标.assets/image-20250123144404697.png)

记住这个东西是crypto封装的字节，有时这个过程会隐藏起来，你只能看到t

如果有个变量直接存放了这些字节，那么就不好用python去处理，所以在console里使用 `t.toString(C.a.enc.Utf8)` 处理后，就能得到原先写在括号里的字符串

![image-20250123144708777](ctbpsp招标.assets/image-20250123144708777.png)

```javascript
t.toString(CryptoJS.enc.Utf8)  // byte -> str
```

记住这个格式

```
CryptoJS.DES.decrypt(
	{密文},
	密钥,
	{
		mode: CryptoJS.mode.xxx 加密方式,
		iv,
		padding: CryptoJS.pad.Pkcs7
	}
)
```

eg. 已经寄掉的网站

![image-20250123155659867](ctbpsp招标.assets/image-20250123155659867.png)

注意有个坑，有时候，一些东西并不会显示出来

![image-20250123160726194](ctbpsp招标.assets/image-20250123160726194.png)
