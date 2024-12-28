---
title: 纷玩岛抢票
published: 2022-07-01
tags: [app逆向, Python]
category: Android
draft: true
---


# 抓包

打开软件，发现一个包都没抓到

关闭手机wifi代理，使用socksdroid抓包

可以抓到包 :D



### 立即购买

```
performance/app/project/get_performs
```

`project_id` 应该是用来标识演唱会的
`standbyChannel` 不知道是啥，固定为1

返回的performId在购票时需要


之后会发送`https://api.livelab.com.cn/performance/app/project/seatPlanStatus?seatPlanIds=6402%2C6403%2C6401%2C6400&type=2`请求，查看是否满人，满人的话，返回的json里"soldOutFlag"为true

似乎每一个演唱会都有它对应的几个seatPlanId

### 确认
```
app/ticket/ticketInfo
```
`seatPlanIds`不知道是什么东东
每个数字对应一种票价价位

### 提交订单

#### 创建订单（发送这个请求就能抢到票了）

```
/app/center/v3/create
```
{"code":11004,"msg":"没有登录，请先登录"}

{"code":490042,"msg":"您选的票数量不足,请重新选择","data":null}

{  "code": 47009,  "msg": "小岛现在太繁忙了, 请稍后点击重试"} 相当于显示的“当前人数请求较多请稍后重试”  风控

{"code":90008,"msg":"系统开小差啦，请稍后重试","data":null} payment写错出现

{"code":110009,"msg":"未到场次的销售时间","data":null}

{"code":41039,"msg":"1804526474604978177","data":null}  有待支付的订单 msg数字会变 是订单编号

{"code":47009,"msg":"当前请求人数多, 请稍后重试","data":null}  这个应该是真的

{
	"code": 10000,
	"msg": "操作成功",
	"data": "1802610819469152258"  订单编号
}

粉丝太热情啦 再试一次吧

#### 返回支付信息（不需要这个）


#### 获取时间戳
```
1719221770691
1719221770859   168
1719221771131   272
1719221771195	64
1719221771258	63
1719221771559	301
1719221771624	65
1719221771897	273
1719221772189	292
1719221772258	69
1719221772326	68
1719221772395	69
1719221772471	76
```

不间断获取大麦服务器时间戳



## 预约抢票

这部分不用写代码，抓包把需要的东西抓到就行

## 候补订单

没抢到票，默认添加候补


# RECORD

试过了，同一个演唱会，手动更改 totalPrice payment seatPlanId 可以成功。这三个参数和价格有关，改价格就改这三个

contactName contactPhone deliveryName deliveryPhone
这4个可以直接改

totalPrice payment 没对上，返回:90008

更改 frequentContactsId 来修改持票人

## 总结
要改的：
projectId 改演唱会
performId 选择场次
totalPrice payment 总票价，人多的话这两个都是 单价x人数
低价位的票容易没

woc md 才发现服务器的时间戳和我的电脑不一样！电脑慢3秒！！！


## 关于风控

有单后重复请求容易导致风控
不明原因触发
猜测和直接发起下单请求有关
手动操作了下单之前的动作发送请求，失败；然后紧接着手动创建订单，成功；玄学！

3604 2520 0303 0902 16
3604 2520 0110 1111 21

### 持票人
```json
{
	"code": 10000,
	"msg": "操作成功",
	"data": [{
		"frequentContactsId": 25590672,
		"name": "*力",
		"idCard": "3****************6",
		"phone": null,
		"idTypeCode": "1",
		"idType": "身份证"
	}, {
		"frequentContactsId": 25590992,
		"name": "*珺",
		"idCard": "3****************1",
		"phone": null,
		"idTypeCode": "1",
		"idType": "身份证"
	}, {
		"frequentContactsId": 25599724,
		"name": "**扬",
		"idCard": "6****************3",
		"phone": null,
		"idTypeCode": "1",
		"idType": "身份证"
	}, {
		"frequentContactsId": 26281112,
		"name": "*燕",
		"idCard": "3****************6",
		"phone": null,
		"idTypeCode": "1",
		"idType": "身份证"
	}]
}
```

#### 获取大麦时间戳

```python
def get_damai_timestamp():
    url = "https://mtop.damai.cn/gw/mtop.common.getTimestamp/"
    headers = {
        'Host': 'mtop.damai.cn',
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': '*/*',
        'User-Agent': 'floattime/1.1.1 (iPhone; iOS 15.6; Scale/3.00)',
        'Accept-Language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    }

    resp = requests.get(url, headers=headers, proxies=proxy, verify=False)

    return int(json.loads(resp.text)['data']['t'])
```


### 风控

2.3s 测试 

多账号，至少25个！！

### 关于倒计时
多次请求取平均值，校准本地时间，用本地时间来倒计时。已知服务器时间比本地时间快一点。

假设服务器在`T`时准时放票，设网络延迟（来/回单程）平均为`t`,最大为`t_max`,最小为`t_min`

本地某时刻为`local_time`,此时发送请求，经过`2t`时间，服务器返回了结果`server_time`

则同一时刻，

本地时间与服务器时间平均差`Δt`=`server_time`-`local_time`-`t`

[//]: # "本地时间与服务器时间差最大`Δt_max`=`server_time`-`local_time`-`t_min`"

[//]: #
[//]: # "本地时间与服务器时间差最小`Δt_min`=`server_time`-`local_time`-`t_max`"


如果希望尽量准点抢票，则请求最迟需要在`T`-`t_min`时发送，对应本地时间在 `T - t_min - Δt_min`时发送

最早不能早于 `T - t_max`，对应本地时间在 `T - t_max - Δt_max` 时发送

### 上面的思路麻烦了，看看这个
```
local_time_1 
				server_time_1
local_time_2
				server_time_2
local_time_3
				server_time_3
local_time_4

```

delta_1 = server_time_1 - local_time_1 

delta_2 = server_time_2 - local_time_2 

......

delta_n = server_time_n - local_time_n 

求出 delta 的最大值 `delta_max` 最小值 `delta_min`

最早发送的时间就是 `T - delta_max ` 最晚 `delta_min`



# 优化

假设一共n个账号，每个账号有一次短时间发送的机会，那么总共有2n次卡点的机会
```
平均来回延迟：68.3265306122449, 最大延迟：93，最小延迟:55, 中位数:68
```


## 多账号抢票

用协程

从本地时间  `T - t_max - Δt_max` 开始发送，直到 `T - t_min - Δt_min` 或 `T`-`t_min` 为止

跨度为 (`T - t_min - Δt_min`) - (`T - t_max - Δt_max`) = `t_max` + `Δt_max` - `t_min` - `Δt_min`

或 (`T - t_min`) - (`T - t_max - Δt_max`) = `t_max` + `Δt_max` - `t_min`

## 每个账号一个IP 用IP池

## 倒计时问题
每个协程之间最短间隔设置16ms 但实际间隔在31-33ms左右




