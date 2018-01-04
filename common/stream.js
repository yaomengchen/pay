const stream = weex.requireModule('stream')
const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal')

let obj = {}

// const host = 'http://bubu.jjtt.cc/jiaorder/bubu'
const host = 'http://aa.eerrpp.cc/boloogo/bubu'
function param(data) {

    var result = "";

    for (var attr in data) {
        if (data.hasOwnProperty(attr)) {
            if(data[attr] != null && data[attr] != undefined && data[attr] != "")
            result += attr + "=" + data[attr] + "&";
        }
    }

    result = result.substr(0, result.length - 1);  
    return result;
}
function getBubuToken(callback) {
    storage.getItem("pay_bubuid",function(e){
        storage.getItem('pay_system_type',function(type){
            storage.getItem('pay_debug_info',function(info){
                if(info.result === 'success' && JSON.parse(info.data).type === 'DEBUG'){
                    callback(e.data,JSON.parse(type.data).API,true,JSON.parse(info.data).code);

                }else{
                    callback(e.data,JSON.parse(type.data).API,false); 
                }
            })
        })
    })
}
function fetch(options,callback,over){
            const headers = options.headers || {};

            getBubuToken(function(token,typeapi,debug,code) {
                options.type = 'json'
                
                headers.token = token;
                options.headers = {
                    'token':token,
                    "Content-Type": 'application/x-www-form-urlencoded'
                }
                options.url = typeapi + options.url; 
                
                if(debug){
                    if(options.url.indexOf('?') != -1){
                        options.url += '&$DEBUG=' + code
                    }else{
                        options.url += '?$DEBUG=' + code
                    }
                }
                if(options.body){
                    options.body = param(options.body)
                }
                stream.fetch(options,res => {
                    let result = '';
                    if(typeof(res.data) == 'string'){
                        result = JSON.parse(res.data)
                    }else{
                        result = res.data
                    }
                    // 拿到返回值时，原res.data = res;
                    if(res.ok){

                        if(result.code == 0){
                            callback(result)
                        }else{  
                            let msg = result.msg
                            if(msg == 'NOT_LOGIN'){
                                 msg = '未登录' 
                            }                             
                            modal.alert({
                                message: msg

                            })                   
                        }
                    // 无返回值时，错误原因
                    }else {
                        modal.alert({
                            message:'网络不畅通或服务器链接不上'
                        })
                    }
                    // 执行方法2
                    if(typeof over == 'function'){
                        over(res)
                    } 
                })
            })

        }
        
    // })
// }
obj.fetch = fetch
export default obj