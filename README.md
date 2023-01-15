## 介绍
基于perfree: [http://perfree.org.cn](http://perfree.org.cn)
基于win98: [https://github.com/1j01/98](https://github.com/1j01/98)， 
开发的win98怀旧博客主题， 让你在电脑浏览博客更符合电脑操作

## 使用
根据perfree官网部署项目, 下载对应版本的Releases版本包, 安装主题即可

## 注意事项
1. 项目的后台是perfree, 在增改动态, 增改文档,都是用的后台的页面, 需要对原有后台页面提交更改成功的逻辑增加对win98主题的判断, 不然layer会报错
用的是win98Theme这个变量去判断的,看代码肯定能看懂的

2. 如果你需要isLock接口, 那么就需要后台增加isLock接口,可以通过后台对应的目录增加以下代码, 这样你就可以通过设置API Access Key来限制访问了
```java
@ApiOperation(value = "锁定状态", notes = "是否锁定")
    @PostMapping("/isLock")
    @ResponseBody
    public ResponseBean getKey() {
        HashMap<String, Object> result = new HashMap<>();
        String webApiAccessKey = OptionCacheUtil.getDefaultValue("WEB_API_ACCESS_KEY", "");
        if (StringUtils.isBlank(webApiAccessKey)) {
            result.put("lock", false);
        } else {
            result.put("lock", true);
        }

        return ResponseBean.success("获取成功", result);
    }
```
![image](https://user-images.githubusercontent.com/48686959/212539150-a9aaf1c3-2f12-42a9-8a05-a7f23d0a4bde.png)

3. pinball嵌入的是98项目的iframe, 你也可以直接拿源码放到你的项目中

4. 我的项目就是perfree的主题, 你可以在这里放入一些你之前写过的项目, 可以直接预览,目前perfree还不支持前端框架类的项目预览, 直接直接切换, 后面作者会加,你也可以直接改

5. 代码片段就是[https://github.com/zmcode/code-share](https://github.com/zmcode/code-share)， 这个项目， 你可以自己部署别的域名， 然后改路径就可以了， 这个也是用的perfree后台

更多的细节可以看98的源码, 很不错的一款开源项目

## 展示
![image](https://user-images.githubusercontent.com/48686959/183547464-bbd40b84-92c1-41cc-9830-0454fa69b513.png)
![image](https://user-images.githubusercontent.com/48686959/183547594-1b51dba9-87b6-4f84-8318-c425174143e2.png)
![image](https://user-images.githubusercontent.com/48686959/212538899-48779016-c1ee-4b65-87f4-87cac2ca5f33.png)
![image](https://user-images.githubusercontent.com/48686959/212538934-a1c03a13-5a7f-4685-ac85-097e02709f4e.png)
![image](https://user-images.githubusercontent.com/48686959/212538950-4bac0984-a096-4b60-a19d-bf3c106cdb76.png)
![image](https://user-images.githubusercontent.com/48686959/212538965-a81f3f86-6e98-42dd-b38b-7866fc043d8b.png)
![image](https://user-images.githubusercontent.com/48686959/212538972-f8b3133f-cb63-4a4c-b31b-bb2aa371b772.png)



