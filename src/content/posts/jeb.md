---
title: jeb note 
published: 2024-12-28
description: jeb related tips
category: 通用知识
tags: [jeb, English]
draft: false
---

# open jeb with specific jdk 

take windows for example, I use `JEB 5.19.0.202410291816` , 

my environmental jdk version is 1.8, but the latest jeb needs 17.

i dont want to change my environmental, that will lead to so many crush on my android studio projects, 

so edit `jeb_wincon.bat`, add this two lines below the first line `@echo off` and save it.

```
set JAVA_HOME=D:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
```

it did work :D

# dynamic debug

press `ctrl B` to set a breakpoint

