import {
  transformAppleCode,
  GetCategoriesByHkType,
} from "@/common/helpers/healthKit";
import {transformDistanceToGlobalUnit, transformTimeToSeconds, transformSecondsToBetterFormat} from '@/common/helpers/units'
import store from "@/store";


import { dataTypeToCalculateAverage } from "@/common/static_data";

export function getHealthData(state) {
  return state.healthData;
}

export function getSpecificHealthData(state) {
  return (code) => {
    return state.healthData[code];
  };
}

function ResumeRange(data,transformValueCallBack,unit){
  let min=transformValueCallBack(data[0].Value,unit);
  let max=transformValueCallBack(data[0].Value,unit);
  if(data && data.length>0){
    data.forEach(record=>{
      let newValue = transformValueCallBack(record.Value,record.Unit)
      if(newValue>max){
        max = newValue
      }
      if(newValue<min)
      {
        min=newValue      
      }
})
  }
  return {title:"Range",value:`${min} - ${max}  ${unit}`}
}
function ResumeSum(data,transformValueCallBack, unit){
  let total=0
  if(data && data.length>0){
    data.forEach((record) => {
      total+= transformValueCallBack(record.Value,record.Unit)
    })
  }  
  
  if(total%1!=0){
    total=total.toFixed(2)
  }
  return {title:"Total",value:`${total} ${unit}`}
  
}
function ResumeAverage(data,transformValueCallBack,unit){

  let total=0
  if(data && data.length>0){
    data.forEach((record) => {
      total+= transformValueCallBack(record.Value,record.Unit)
    })
    total = total/data.length
  }  
  
  if(total%1!=0){
    total=total.toFixed(2)
  }
  return {title:"Average",value:`${total} ${unit}`}
}

function ResumeCount(data){
  let dataLength = data?data.length:0
  return {title:"Total",value:`${dataLength} entries`}
}

function ResumeSleepAnalisis(data){
  let sumInBedSeconds = 0;
  let sumASleepSeconds = 0;
  let countInBed = 0;
  let countASleep=0;
  let daysCounted = []
  // need sum a sleep in the same day
  if(data && data.length>0){
    data.forEach(record => {
      if(record.HkValue=="InBed"){
        sumInBedSeconds+=transformTimeToSeconds(record.Value,record.Unit)
        countInBed++;
      }
      else{        
        sumASleepSeconds+=transformTimeToSeconds(record.Value,record.Unit)
        
        if(!(daysCounted.includes(record.StartDate.getTime()))){
          countASleep++;
          daysCounted.push(record.StartDate.getTime())
        }        
      }
    });
  }
  let inBedAverage = transformSecondsToBetterFormat(sumInBedSeconds/countInBed);
  let aSleepAverage =transformSecondsToBetterFormat(sumASleepSeconds/countASleep);



  return {title:"Sleep Average",value:`Average In Bed: ${inBedAverage.Value} ${inBedAverage.Unit} / Average ASleep: ${aSleepAverage.Value} ${aSleepAverage.Unit}` }
}

export function getHealthDataGraphResume(state){
  return (code)=>{
    let data= state.healthData[code]

    let result = { title:"", value:"",date:""}

    switch(code){
      case "HKQuantityTypeIdentifierHeartRate": 
      
      let Unit =  (data&&data.length>0) ?data[0].Unit:""
      if(data&&data.length>0){
        result = ResumeRange(data,(param,unit)=>{return param},Unit)
      }
        
      break;
      case "HKCategoryTypeIdentifierSleepAnalysis":
        result = ResumeSleepAnalisis(data)
        break;
      case "HKQuantityTypeIdentifierDistanceWalkingRunning":
        result = ResumeSum(data,transformDistanceToGlobalUnit,store.getters['units/getDistanceUnit'])
      break;
      case "HKQuantityTypeIdentifierFlightsClimbed":
        result = ResumeSum(data,(param,unit)=>{return param},"floors")
        break;
      default:
        if(dataTypeToCalculateAverage.includes(code)){
          let Unit = (data&&data.length>0) ?data[0].Unit:""
          result = ResumeAverage(data,(param)=>{return param}, Unit)
        }  
        else if (code.includes("Quantity")) {          
          let Unit = (data&&data.length>0) ?data[0].Unit:""
          result = ResumeSum(data,(param)=>{return param},Unit)
        }        
        else{
          result = ResumeCount(data)
        }
        break;
    }    
    return result
  }
}

export function getSpecificHealthDataGrapFormat(state) {
  return (code) => {
    let data = state.healthData[code];
    let dataFormat = [];
    if (code == "HKCategoryTypeIdentifierSleepAnalysis") {
      return SleepAnalisysData(data);
    } else if (code == "HKQuantityTypeIdentifierHeartRate") {
      return HeartRateData(data);
    }
    else if(code == "HKCategoryTypeIdentifierMindfulSession"){
      return MinfdfulData(data)
    }
    else if (code == "HKCategoryTypeIdentifierSexualActivity"){
      return SexualActivityData(data)
    }
    else if (code.includes("Quantity")) {
      let dataDict = {};
      if(data && data.length>0){
        data.forEach((record) => {
          let value = record.Value;
          let dateFormat = DateFormat(record.Date.Date);
          if (dateFormat in dataDict) {
            dataDict[dateFormat].value += value;
            dataDict[dateFormat].count += 1;
          } else {
            dataDict[dateFormat] = {
              date: record.Date.Date,
              value: value,
              count: 1,
            };
          }
        });
      }
      for (const [key, value] of Object.entries(dataDict)) {
        if (dataTypeToCalculateAverage.includes(code)) {
          value.value = value.value / value.count;
        }
        dataFormat.push({ x: value.date, y: value.value.toFixed(2) });
      }
    }
    else if (code.includes("HKWorkout")) 
    {
      let types = {}
      let dataFormat = []

      if(data && data.length){
        data.forEach((record) => {
          if(record.Extrada){
            for (const [key, value] of Object.entries(record.Extrada)) {
              if(types[key]){
                let previousData = types[key]                
                previousData.push({x:record.Date.Date, y:value.value})
              }
              else{
                types[key]=[{x:record.Date.Date, y:value.value}]  
              }
            }
          }
        })
        for (const [key, value] of Object.entries(types)) {
          dataFormat.push({name:key,data:value})
        }
        return dataFormat

      }
      return [
        {
          name: code,
          data: dataFormat,
        },
      ];
    }
    else {
      
      if(data && data.length){
        data.forEach((record) => {
          let yValue = record.Value;
          if (code.includes("Category")) {
            let array = GetCategoriesByHkType(code);
            yValue = array.indexOf(yValue);
          }
          dataFormat.push({ x: record.Date.Date, y: yValue });
        });
      }
    }
    return [
      {
        name: code,
        data: dataFormat,
      },
    ];
  };
}

function DateToSeconds(date) {
  let dateHours = date.getHours();
  let dateMinutes = date.getMinutes();
  let dateSeconds = date.getSeconds();
  let seconds = (dateHours * 60 + dateMinutes) * 60 + dateSeconds;
  return seconds;
}

function DateFormat(date) {
  return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
}

function DateFormatHour(date) {
  return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate()+"/"+date.getHours();
}


function SleepAnalisysData(data) {
  let inBedArray = [];
  let aSleepArray = [];
  if (data && data.length>0){
    data.forEach((record) => {
      let startTime = DateToSeconds(record.StartDate);
      let endTime = DateToSeconds(record.EndDate);

      if (record.EndDate.getDate() != record.StartDate.getDate()) {
        let maxValue = (23 * 60 + 59) * 60 + 59;
        let yValue1 = [startTime, maxValue];
        let yValue2 = [0, endTime];

        if (record.HkValue == "InBed") {

          inBedArray.push({
            x: record.StartDate.setHours(0,0,0),
            y: yValue1,
          });
          inBedArray.push({
            x: record.EndDate.setHours(0,0,0),
            y: yValue2,
          });

        } else {
          aSleepArray.push({
            x: record.StartDate.setHours(0,0,0),
            y: yValue1,
          });
          aSleepArray.push({
            x: record.EndDate.setHours(0,0,0),
            y: yValue2,
          });
        }
      } else {
        let yValue = [startTime, endTime];
        if (record.HkValue == "InBed") {
          inBedArray.push({
            x: record.StartDate.setHours(0,0,0),
            y: yValue,
          });
        } else {
          aSleepArray.push({
            x: record.StartDate.setHours(0,0,0),
            y: yValue,
          });
        }
      }
    });
  }
  
  return [
    {
      name: "inBed",
      data: inBedArray,
    },
    {
      name: "aSleep",
      data: aSleepArray,
    },
  ];
}

function HeartRateData(data) {
  let dataFormat = []
  let dataDict = {};
  if(data&&data.length>0){
    data.forEach((record) => {
      let value = record.Value;
      if(value%1!=0){
        value = parseFloat(value.toFixed(2))
      }
      let dateFormat = DateFormatHour(record.Date.Date);
      if (dateFormat in dataDict) {
        if(value>dataDict[dateFormat].max){
          dataDict[dateFormat].max= value;
        }
        if(value<dataDict[dateFormat].min){
          dataDict[dateFormat].min= value;
        }
      } else {
        let date = new Date(record.Date.Date.setMinutes(0,0))
        dataDict[dateFormat] = {
          date: date,
          max: value,
          min: value
        };
      }
    });
  }
  for (const [key, value] of Object.entries(dataDict)) {
    dataFormat.push({ x: value.date, y: [value.min,value.max] });
  }
  return [
    {
      name: "Heart Rate",
      data: dataFormat,
    },
  ];
}

function MinfdfulData(data){
  let dataFormat = []
  // dataFormat.push({x:"TEST",y:[new Date(),]})
  if(data && data.length>0){
    data.forEach((record)=>{
      dataFormat.push({ x: "Mind", y: [record.StartDate.getTime() ,record.EndDate.getTime()] });
    })
  }

  return[{
    name: "Mindful Minutes",
    data:dataFormat
  }]
}

function SexualActivityData(data){
  let dataFormat = []
  let dataDict = {}
  if(data && data.length>0){
    data.forEach((record) => {
      let date = DateFormat(record.Date.Date)
      if (dataDict[date]){
        dataDict[date].count+=1
      }
      else{
        dataDict[date]={
          date:date,
          count:1
        }
      }
    })
  }
  for (const [key, value] of Object.entries(dataDict)) {
    dataFormat.push({ x: value.date, y: value.count });
  }

  return [{
    name: "Sexual Activity",
    data: dataFormat
  }]
} 

export function getCategoryDataWebFormat(state) {
  return (categoryId) => {
    return state.healthWebFormat[categoryId];
  };
}

export function getValidCategories(state){
  return state.validCategories
}

export function getActivityIndexDataToGraphic(state){
  
  let metrics =state.userMetricData
  let data=[]
  metrics.forEach(element => {
    data.push({"x":Date.parse(element.date),"y": parseInt(element.activityindex) })
  });
  let response = [{
    "name":"ActivityIndex",
    "data":data
  }]
  return response
  

  /* 
  [ 
    { "name": "HKQuantityTypeIdentifierDistanceWalkingRunning", 
      "data": [ 
        { "x": "2021-08-03T20:43:30.823Z", "y": "131.68" }, 
        { "x": "2021-08-06T14:54:49.220Z", "y": "631.60" }, 
        { "x": "2021-08-09T16:06:59.679Z", "y": "421.70" }, 
        { "x": "2021-08-10T15:03:12.788Z", "y": "889.07" }, 
        { "x": "2021-08-11T05:04:47.586Z", "y": "2209.50" } 
      ] 
    } 
  ]
*/

  return metrics

}