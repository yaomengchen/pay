let obj = {}
let after = ''
const navigator = weex.requireModule('navigator')
const modal = weex.requireModule('modal')
const storage = weex.requireModule('storage')
function push(options,callback){
    if(typeof window === 'object'){
        // pc端页面展示
        // var href = 'http://192.168.2.225:8080/web'+ options.url +'.html'+ (options.query? options.query : '')
        // window.location.href =  href
        after = '.html'
    }else{
        after = '.js'
    }

        // 正式服（客户使用 化妆品使用正式地址）
        // options.url = 'http://boloogo-sys.oss-cn-shanghai.aliyuncs.com/app/work/storePay1000/1000' +  options.url + '.js' + (options.query? options.query : '')
        // 正式服（开发测试）
        getConfig(function(typesrc) {
            options.url = typesrc + options.url + after; 
            // options.url = 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/main' +  options.url + '.js' + (options.query? options.query : '')
            navigator.push({
                'url':options.url + (options.query? options.query : ''),
                'animated':options.animated
            },callback)
        });
        // options.url = 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/paySystemApp/main' +  options.url + '.js' + (options.query? options.query : '')
        // navigator.push({
        //     'url':options.url,
        //     'animated':options.animated
        // },callback)
}
function pop(options,callback){

    if(typeof window === 'object'){
        
        window.history.back()

    }else{
        
        navigator.pop(options,callback)
    }

}
function getConfig(callback) {
        storage.getItem('pay_system_type',function(type){
            callback(JSON.parse(type.data).SRC);
        })

}
obj.push = push
obj.pop = pop
export default obj