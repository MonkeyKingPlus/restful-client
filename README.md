# restful-client
RESTful client . 支持Redux,可以使用在react native , react 等其他JavaScript项目中.

# Install
```bash
$ npm install mkp-restful-client --save
```

# Quick Start
```javascript
//引用RESTful client
import RESTfulClient from "mkp-restful-client";
//初始化RESTful client
let rest=new RESTfulClient();

window.$rest=rest;

//request json
rest.request({
    url:"https://api.github.com/users/mralexgray/repos"
}).then(response=>{
    console.log(response);
})
```

# RESTful client Events
* beforeSend(requestConf[,dispatch]) - 在请求发生之前调用,此事件可以对requestConf进行重写
* sending(requestConf,xhr[,dispatch]) - 在请求发生时调用.
* received(requestConf,response,xhr[,dispatch]) - 在请求回来时调用
* success(response[,dispatch]) - 在请求成功时调用
* error(err[,dispatch]) - 在请求发生错误时调用
* complete(requestConf[,dispatch]) - 在请求结束时调用
```javascript
let rest =new RESTfulClient({
    beforeSend(options, dispatch){
    },
    sending(options, xhr, dispatch){
    },
    received(options, response, xhr, dispatch){
    },
    success(response, dispatch){
    },
    error(err, dispatch){
    },
    complete(options, dispatch){
    }
})
```

# Methods
## request(requestConf[,dispatch])
方法返回一个Promise对象,如果使用了Redux,根据需要是否传入dispatch.
* requestConf.url - 请求的url
* requestConf.type - default("get"),请求的类型
* requestConf.canAbort - default(false),是否可以被终止
* requestConf.headers - default({}"),http头信息
* requestConf.data - 请求的数据
* dispatch - 如果使用的Redux可以根据需求决定是否传入dispatch.可以不提供.
