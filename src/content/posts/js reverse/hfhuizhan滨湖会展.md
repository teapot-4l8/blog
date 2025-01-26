---
title: 合肥滨湖国际会展中心
description: 请求data加密，返回数据解密
category: 网页爬虫
tags: [AES, Python, Javascript, js2py, English, js逆向]
published: 2025-01-26
draft: false
---

target： https://www.hfhuizhan.com

1. data encryption

   ![image-20250125223344860](hfhuizhan滨湖会展.assets/image-20250125223344860.png)

2. response descryption

   ![image-20250125223448762](hfhuizhan滨湖会展.assets/image-20250125223448762.png)

## search

notice `Promise.then`, so search `interceptors` in `Search` tab

![image-20250125224543281](hfhuizhan滨湖会展.assets/image-20250125224543281.png)

enter

![image-20250126100721807](hfhuizhan滨湖会展.assets/image-20250126100721807.png)

## request data encryption

check out `At`, we got `requestInterceptors`

![image-20250126100818701](hfhuizhan滨湖会展.assets/image-20250126100818701.png)

![image-20250126101050580](hfhuizhan滨湖会展.assets/image-20250126101050580.png)

```python
```



## response decryption

enter the interceptors `At`, got this function

![image-20250126111843605](hfhuizhan滨湖会展.assets/image-20250126111843605.png)

but dont click `cr` while mouse hanging over it, its asychronous so it will enter a wrong function. at this situation, single step debugger is not suitable

![image-20250126112032415](hfhuizhan滨湖会展.assets/image-20250126112032415.png)

just click `cr` and notice its above that function

![image-20250126112658962](hfhuizhan滨湖会展.assets/image-20250126112658962.png)

**remember: When the code is the same as that framed by the orange box in the figure, it indicates the feature of asynchronous execution.** 

At this point, **do not perform single-step debugging.** Consider the `case` as `await` a task.

`Jt.sent` receive the response value of it's last step :`ot.clone().text()`

set breakpoints at `return ...` below `case x`, use **this button** to debug

![image-20250126113502466](hfhuizhan滨湖会展.assets/image-20250126113502466.png)

if you want to jump from `case 0` to `case 3`, different cases, use **this button**. but in the case block, single step debug is OK.

`Jt.next = 3` means its next task is in the `case 3` block. the result of `ot.clone().next()` cant be found in the block `case0`, you must step into `case 3` Jt.sent to retrive its value.

![image-20250126114456692](hfhuizhan滨湖会展.assets/image-20250126114456692.png)

after `mr()`, `kt` can be parsed by `Json`, so `mr` may be the decrypt function

boom

![image-20250126114907521](hfhuizhan滨湖会展.assets/image-20250126114907521.png)

