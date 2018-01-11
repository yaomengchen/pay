export function timeHandleFilter (value) {
    if(value) {
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth()
        const day = today.getDate()
        let searchList = ['昨天','今天'].map(item => {
            return {
                startTime : new Date(year,month,day-1,0,0,0),
                endTime : new Date(year,month,day-1,23,59,59),
                tag : item,
            }
        })
        let tag = ''
        let valueTime = new Date(Date.parse(value))
        searchList.some(item => {
            if(valueTime >= item.startTime && valueTime <= item.endTime) {
                tag = item.tag 
                return true
            }
        })
        if(tag) {
            return tag + " " + valueTime.getHours() + ":" + valueTime.getMinutes()
        }else {
            return value.substring(0,value.length-5)
        }
    }

}