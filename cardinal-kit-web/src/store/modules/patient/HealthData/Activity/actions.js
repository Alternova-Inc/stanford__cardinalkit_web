import {FetchCategoryTypeData,FetchQuantityData,FetchActivities, FetchLastQuantityData} from "../../index"

export function reset({ commit }) {
  commit("RESET");
}

export const FetchLastActivityData = async ({commit}, payload)=>{
  let data = 
  await Promise.all([
    FetchLastQuantityData("HKQuantityTypeIdentifierDistanceWalkingRunning",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierActiveEnergyBurned",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierAppleStandTime",{...payload,limit:1}),      
    FetchLastQuantityData("HKQuantityTypeIdentifierAppleStandHour",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierAppleExerciseTime",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierFlightsClimbed",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierPushCount",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierDistanceWheelchair",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierDistanceCycling",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierDistanceDownhillSnowSports",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierBasalEnergyBurned",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierSwimmingStrokeCount",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierDistanceSwimming",{...payload,limit:1}),
    FetchLastQuantityData("HKQuantityTypeIdentifierStepCount",{...payload,limit:1}),
    FetchActivities({...payload}),
  ])
  commit("saveLastCategoryData",{ 
    category: payload.category,
    data: data
  })
  return {name:"activity","data":data.filter(e => (e && e.length>0))}
}
      

