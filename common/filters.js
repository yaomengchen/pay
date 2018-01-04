/*
    显示价格的过滤器 
    如果存在小数 保留两位小数 否则取整 
    并且加上货币符号
*/

function price(val){
    if(!val && Number(val) == NaN) return ''
    return val % 1 == 0 ? ('¥' + Number(val)) : ('¥' + Number(val).toFixed(2))
}
var filter = {
    price : price
}
export default filter