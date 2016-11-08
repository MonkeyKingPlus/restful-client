var superagent = require("superagent");
console.log(fetch)

var RESTfulClient=require("../lib/RESTfulClient").default;

var client=new RESTfulClient({
	clientEngine:{
		name:"superagent",
		client:superagent
	}
});

client.request({
	url:"https://api.github.com/users/mralexgray/repos"
}).then(res=>{
	console.log("superagent:"+res.body.length);
});
