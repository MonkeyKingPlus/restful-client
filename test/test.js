var superagent = require("superagent");

var RESTfulClient=require("../lib/RESTfulClient").default;

var client=new RESTfulClient({
	clientEngine:{
		name:"superagent",
		client:superagent
	},
	normalizeResponse:res=>{
		console.log("normalizeResponse")
		res.data=res.body;
		return res;
	}
});

client.request({
	url:"https://api.github.com/users/mralexgray/repos"
}).then(res=>{
	console.log("superagent:"+res.body.length+":"+res.data.length);
});
