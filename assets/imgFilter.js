export const imgFilter = (input, type, requireHost) => {
    // if (value == null || value == '') {
    //     return '';
    // }

    if (input == null || input == '') {
        return '';
    }

    var fileHost = '';
    //如果 input 中 有 //boloogo-sys.oss-cn-shanghai.aliyuncs.com/product.png
    //那么 不添加 requireHost
    if (input != null && input != "") {
        if (input.toString().indexOf("boloogo-sys.oss-cn-shanghai.aliyuncs.com") == -1 &&  input.toString().indexOf("img.eerrpp.cc/upload/bm/") == -1) {
            if (requireHost == null) {
                fileHost = "//jiaorder-file.oss-cn-shanghai.aliyuncs.com/";
            }
        }
    }else {
        input = ' http://jiaorder-file.oss-cn-shanghai.aliyuncs.com/product.png';
    }


    var value = "?x-oss-process=image/resize,m_fill,h_220,w_220";

    if (type == 'small') {
        value = "?x-oss-process=image/resize,m_fill,h_140,w_140";
    } else if (type == 'middle') {
        value = "?x-oss-process=image/resize,m_fill,h_360,w_360";
    } else if (type == 'large') {
        value = "?x-oss-process=image/resize,m_fill,h_960,w_960";
    } else if (type == 'none') {
        value = "";
    } else if (type == 'min') {
        value = "?x-oss-process=image/resize,m_fill,h_80,w_80";
    }

    return fileHost + input + value;

        
}