import { transformAppleCode,transformHealthDataToGlobalFormat } from "@/common/helpers/healthKit"
import { dataTypeToCalculateAverage, dataTypeToRounded } from "@/common/static_data"



export function saveSpecificTypeData(state, payload) {
    let copy = {...state.healthData}
    copy[payload.datatype] = payload.data
    state.healthData=copy
}



export function saveLastCategoryData(state, {category,data}){
    
    let categoryWebFormat = []
    data.forEach(element => {        
        if(element && element.length>0){
            let transform = transformHealthDataToGlobalFormat(element[0])
            if (transform.HkCode.includes("HKWorkoutActivityType")){
                if(element.length>1){
                    element.forEach((row)=>{
                        categoryWebFormat.push(transformHealthDataToGlobalFormat(row))
                    })
                }
                else{
                    categoryWebFormat.push(transform)
                }
            }
            else if(!transform.HkCode.includes("Category")){
                    transform.Value = 0
                element.forEach(record => {
                    let NewRecord = transformHealthDataToGlobalFormat(record)
                    transform.Value += NewRecord.Value
                });        
                if(dataTypeToCalculateAverage.includes(transform.HkCode)){
                    transform.Value=transform.Value/element.length
                    if(dataTypeToRounded.includes(transform.HkCode)){
                        transform.Value = Math.round(transform.Value)
                    }
                }
                transform.Value= parseFloat(parseFloat(transform.Value).toFixed(2))
            }
            categoryWebFormat.push(transform)
        }
    });
    let copyHealth = {...state.healthData}
    copyHealth[category]=data
    state.healthData=copyHealth
    
    let copyWebFormat = {...state.healthWebFormat}
    copyWebFormat[category]=categoryWebFormat
    state.healthWebFormat=copyWebFormat
}

export function saveValidCategories(state,payload){
    state.validCategories = payload
  }

export function saveMetricData(state,metricData){
    state.userMetricData=metricData 
}