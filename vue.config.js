module.exports={
    devServer:{
       // host:"localhost",
        port:8081,
        //以上的ip和端口是我们本机的;下面为需要跨域的
        open:true,
        // proxy:{
        //     "/apis":{
        //         target:'http://localhost:8080/',
        //         ws:true,
        //         changOrigin: true,//允许跨域
        //         pathRewrite: {
        //             '^/apis': '/'//请求的时候使用这个api就可以
        //         }

        //     }
        // }
    }
}