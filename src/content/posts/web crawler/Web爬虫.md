---
title: web爬虫基础知识
published: 2023-08-01
tags: [笔记, Python, Java, English, 爬虫]
draft: false
category: 网页爬虫
lang: 'English'
---

# basic knowledge

return shit like `è¾è®¯å°åè·åä½ç½®`

```python
response = requests.post()
r = response.content.decode('utf-8')
print(r)
```

will be fine

## change UA on devtools

![image-20241003133453070](Web爬虫.assets/image-20241003133453070.png)

## convert curl 2 python

in pycharm's market, search `Headers`. this plugin let you copy headers in develop tools and paste it in pycharm conveniently. just right click and choose `Headers` -> `Headers`

## encrypt numbers

- sha1

```
[1732584193, 4023233417, 2562383102, 271733878, 3285377520]
```

- md5

```
[1732584193, 4023233417, 2562383102, 271733878]
```


## proxy

use clash for example

```python
import requests

url = "https://www.google.com.sg/"
headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
}
proxy = {
    "http": "http://127.0.0.1:7890",
    "https":"http://127.0.0.1:7890"
}

resp = requests.get(url, headers=headers, proxies=proxy)
print(resp.text)
```


# extract data

## re





## xpath

# thread & process


# asyncio

```python
import asyncio
import aiohttp  # used to send requests asynchronously
import aiofiles  # write files asynchronously

my_headers = {}

async def download_one_img(url):
    file_name = url.split("/")[-1]
	async with aiohttp.ClientSession(headers=my_headers) as session:
        async with session.get(url) as resp:
            # result = await resp.text()
    		content = await resp.content.read()  # wait for bytes, like pictures
            async with aiofiles.open(file_name, mode='wb') as f:
                await f.write(content)
            
           
async def download(url):
    print("start")
    await asyncio.sleep(0.5)  # downloading a img...
    print("finished")
    return "this is a string"

async def main():
    urls = [
        'http://xx1',
        'http://xx2',
        'http://xx3',
    ]
    tasks = []
    for url in urls:
        tasks.append(asyncio.create_task(download(url)))
    done, pedding = await asyncio.wait(tasks)
    for d in done:
        print(d.result())

        
if __name__ == '__main__':
    asyncio.run(main())
```

 `RuntimeError: Event loop is closed` may occurs on Windows platform

just change `asyncio.run(main())` into

```python
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
```

# data base

## mysql

```bash
net start mysql57
mysql -u root -p
6666
```

```sql
SHOW DATABASES;
```


## Redis

one of nosql database. faster than MySQL, large space, "high performance"

as a cache/memory/middleware"

** for high concurrency, distributed web crawlers **

### preparatory work

1. close bind

```
# bind 127.0.0.1 ::1  # comment it
```

2. close protect mode (windows dont do this)

```
protected-mode no  # set as no
```

3. open redis.windows.conf

```conf
requirepass 123456   # set password
```


```cmd
# install redis on windows platform. enter the file position first
redis-server.exe --service-install redis.windows.conf --loglevel verbose
# uninstall redis server
redis-server --service-uninstall
# start
net start redis
or
redis-server --service-start
# stop
redis-server --service-stop
```

Set it in the environment variables

### connect to redis

```cmd
redis-cli
auth [password]   # if it has password, if not, ignore it
```

### Redis common data types

1. String
```
set [key] [value]  # add a new data
get [key]		   # Retrieve the data
incr [key]       # Increment the data corresponding to this [key] by 1 (atomic, safe)
incrby [key] [count]     # Increment the value corresponding to the [key] by [count]
type [key]		# View the data types (all items inserted into a set are always strings)
```

2. List

```
LPUSH [key] data1 data2 data3 ... # Insert data1, data2, data3, etc., from the left into the list named key, resulting in the order [data3, data2, data1]
RPUSH [key] data1 data2 data3.... # Insert data1, data2, data3, etc., from the right into the list named key, resulting in the order [data1, data2, data3, ...]
LRANGE [key] start stop     #  Retrieve elements from the list named [key] between the start and stop indices.  `LANGE [key] 0 -1` retrieve all elements

LLEN key	# Return the length of the list named key
LPOP [key]        # Remove and return the first element (from the left) of the list named key
RPOP key		# Remove and return the last element (from the right) of the list named key
```

3. Set
```
SADD [key] value   # Add the specified member to the set stored at key
SMEMBERS [key]  # Return all the members of the set value stored at key
SCARD [key] # Get the number of members in a set
SISMEMBER [key] val  # Check if the specified value is in the set stored at key
SUNION key1 key2  # Compute the union of the sets given by the specified keys
SDIFF key1 key2  # Compute the difference between the sets stored at key1 and key2
SINTER key1 key2 #  Compute the intersection between the sets stored at key1 and key2
SPOP [key]  # Remove and return a random member from the set
SRANDMEMBER [key] count # Get one or multiple random members from the set
```

4. Sorted Set

```
ZADD key s1 m1 s2 m2 ... # Add the specified members with the specified scores to the sorted set stored at key
ZRANGE key start stop [withscores]   # Retrieve all the elements in the sorted set stored at key within the range from start to stop, with the optional inclusion of their scores
ZREVRANGE key start stop # Retrieve all the elements in the sorted set stored at key within the range from start to stop, in reverse order
ZCARD key   # Get the number of members in a sorted set
ZCOUNT key min max  # Count the number of members in a sorted set with scores within the given range
ZINCRBY key score member  # Increment the score of a member in a sorted set by the given amount
ZSCORE key m  # Get the score of a member in a sorted set
ZREM key m # delet the sepecific m
ZRANK key m # judge if m exists in key, return 1 if exist, is not, reutrn null
```


5. Hash
similar to dictinory

```
hset [key] k1 v1   # Store the key-value pair k1, v1 in the hash named key
hget [key] k1      # Retrieve the value associated with k1 from the hash named key
hmset [key] k1 v1 k2 v2 k3 v3....  # Store multiple key-value pairs in the hash named key
hmget [key] k1 k2....# Retrieve multiple values from the hash named [key] for the specified keys
hgetall [key] 	# Retrieve all items in the hash named key
hkeys key		# Retrieve all keys from the hash named key
hvals [key] 		# Retrieve all values from the hash named key
```

6. Bitmap
7. HyperLogLog
8. Geospatial



## mongoDB





# git

**查看某个提交之前的文件内容**（不改变当前工作目录）

```bash
git checkout <commit_hash> -- <file_path>
```



When you've cloned a repository from GitHub, made changes to the code, and want to push those changes to your own repository while also pulling in the latest updates from the original repository, you can follow these steps:

1. **Add Your Remote Repository**: First, you need to add the remote repository where you want to push your changes. This is typically your GitHub repository.

   ```bash
   git remote add origin <your-repository-url>
   ```

2. **Check the Status of Your Branch**: Check the status of your branch to ensure your changes have been committed.

   ```bash
   git status
   ```

3. **Commit Your Changes**: If your changes are not yet committed, use `git add` to stage the changes and then `git commit` to commit them.

   ```bash
   git add .
   git commit -m "Describe your changes"
   ```

4. **Pull the Latest Updates from the Original Repository**: Before pushing your changes, you need to pull the latest updates from the original repository. First, you need to add the original repository as another remote source.

   ```bash
   git remote add upstream <original-repository-url>
   ```

5. **Fetch the Latest Updates from the Original Repository**: Fetch the latest updates from the `upstream` remote source.

   ```bash
   git fetch upstream
   ```

6. **Merge the Updates**: Merge the updates from the original repository into your current branch.

   ```bash
   git merge upstream/main
   ```

   Here, it's assumed that the branch you cloned is `main`. If it's a different branch, replace `main` with the appropriate branch name.

7. **Resolve Conflicts**: If there are conflicts during the merge, you'll need to manually resolve them. After resolving conflicts, use `git add` to stage the changes and `git commit` to commit the code with conflict resolutions.

8. **Push to Your Repository**: Once the merge is complete and there are no conflicts, you can push your changes to your remote repository.

   ```bash
   git push origin main
   ```

9. **Regularly Sync**: To keep your branch in sync with the original repository, you can regularly repeat steps 4 to 8.

Please note that if your changes conflict with the changes in the original repository, you may need to manually resolve these conflicts. Always ensure you have a backup of your work in case you need to revert to a previous state.



In summary, **cloning** is about creating a local copy of a repository that you can **work on independently**, while **forking** is about creating a personal copy of a repository on a platform like GitHub to **contribute to or modify without affecting the original project**. Forking is often the preferred method when you want to contribute changes back to the original repository, as it simplifies the process of submitting pull requests.



# certificate installation

checkout certificate

redmi：设置 - 密码与安全 - 系统安全 - 加密与凭据 - 【信任的凭据 + 用户凭据】

sometimes you have installed `trustmealready` or `justtrustme` but app still popping out message like `without internet` 

that may because your certificate is outdated, reinstalled certificate can fix it.

## mitm

https://www.cnblogs.com/oboth-zl/p/13818981.html

1. go checkout `C:\Users\Administrator\.mitmproxy`

2. ```
   >>>openssl x509 -subject_hash_old -in  证书文件路径
   ```

3. will output number like `c8750f0d.0`

4. rename `mitmproxy-ca-cert.pem` to that number

5. 

```
adb shell
su
#挂载系统目录为可写
mount -o rw,remount /
mv /sdcard/c8750f0d.0 /system/etc/security/cacerts
#修改证书权限
chmod 644 /system/etc/security/cacerts/c8750f0d.0
```

## Charles

proxy 192.168.43.71

port 8888
