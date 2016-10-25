# restful-client
RESTful client,Redux is supported,you could use it in all of javascript projects especially React and React Native.

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
* beforeSend(requestConf[,dispatch]) - invoke before request , you can override the request options in this time.
* sending(requestConf,xhr[,dispatch]) - immediately invoke when the request is sent. 
* received(requestConf,response,xhr[,dispatch]) - immediately invoke when the response is return.
* success(response[,dispatch]) - invoke when request is successful.
* error(err[,dispatch]) - invoke when request error is occurred.
* complete(requestConf[,dispatch]) - invoke when all of them is done.
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
the method will return a promise object.
* requestConf.url - request url
* requestConf.type - request method , the default value is 'get'.
* requestConf.canAbort - marking the request whether can be terminated , the default value is false.
* requestConf.headers - http headers
* requestConf.data - request data
* dispatch - you could specify the parameter when redux is available.

## get(url[,data,dispatch,ops={}])

## post(url[,data,dispatch,ops={}])
