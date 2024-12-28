---
title: IDA特训
published: 2024-12-01
tags: [笔记, 汇编]
category: Android
draft: true
---

## ida使用

### 修改汇编指令

1. 把鼠标定位到要修改的指令(函数图上的就行)
2. 调出16进制的窗口 `View` -> `Open subviews` ->`Hex dump` （这步可以不做）
3. 修改 `Edit` -> `Patch program` -> `Change byte...`
4. 改完后，记得保存 `Edit` -> `Patch program` -> `Apply patches to input file`

### 快捷键

`Shift + F12` 调出字符串窗口

`Alt + T` 搜索字符串



# 静态分析

![image-20240502143137919](IDA特训.assets/image-20240502143137919.png)

在伪代码窗口，鼠标定位到想看的那行，再点Tab，就能定位到它相应的汇编代码

字符串表 `shift + F12`

双击某字符串，进入定义的位置

字符串不一定全

![image-20240502150722547](IDA特训.assets/image-20240502150722547.png)

1. 右键 `Edit`进入编辑模式。
2. 右键`apply changes`退出编辑模式。
3. Edit->Patch program -> Apply patches to input file... 保存

ctrl+v撤销上一次操作

![image-20240502151000140](IDA特训.assets/image-20240502151000140.png)

如果跳转了其它窗口，是因为跟点前的窗口有关。需要再点一下你像切换过去的窗口，然后在跳转，就可以跳转到同款窗口了

![image-20240502152824222](IDA特训.assets/image-20240502152824222.png)

![image-20240502153836364](IDA特训.assets/image-20240502153836364.png)

这个可以锁定高亮，让某个单词一直亮着

![image-20240502195006342](IDA特训.assets/image-20240502195006342.png)

关键：`0x3F`猜测是base64

base64编码过程，有‘=‘是编码，解码没有`=`

在伪代码窗口，光标定位在十六进制，按下`h`可以转成十进制；按`r`切换成对应的ascii编码字符

![image-20240502202427039](IDA特训.assets/image-20240502202427039.png)

在 db上按下`d`建，会把db变成dw,再按下变成dd，然后dq

![image-20240502202822092](IDA特训.assets/image-20240502202822092.png)

按`u`把字符转成数字

![image-20240502210004937](IDA特训.assets/image-20240502210004937.png)

![image-20240502211301759](IDA特训.assets/image-20240502211301759.png)



数据和代码是可以相互转换的；把jz,jnz连起来的代码下方转成数据，然后选中（记得多选一行）转成nop

![image-20240502212514173](IDA特训.assets/image-20240502212514173.png)

![image-20240502212330829](IDA特训.assets/image-20240502212330829.png)

全部处理完后，让ida重新分析函数

![image-20240502212636677](IDA特训.assets/image-20240502212636677.png)

![image-20240502212924591](IDA特训.assets/image-20240502212924591.png)

IDA内置函数、类型定义在头文件defs.h

# 动态调试

如果不小心关掉了什么窗口，去debugger->debugger windows找

ctrl+P跳转ip强制让程序执行到某个地方，不根据判断结果

F2设置断点

![image-20240503224203909](IDA特训.assets/image-20240503224203909.png)

![image-20240503224307061](IDA特训.assets/image-20240503224307061.png)

![image-20240503224617338](IDA特训.assets/image-20240503224617338.png)

## 断点

![image-20240505190038588](IDA特训.assets/image-20240505190038588.png)
