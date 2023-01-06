import {
    FetchLastQuantityData,
  } from "../../index";
  
  export const FetchLastRespiratoryData = async ({ commit }, payload) => {
    let data =  await Promise.all([
      FetchLastQuantityData("HKQuantityTypeIdentifierOxygenSaturation", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierInhalerUsage", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierRespiratoryRate", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierForcedExpiratoryVolume1", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierForcedVitalCapacity", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierSixMinuteWalkTestDistance", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierPeakExpiratoryFlowRate", {...payload,limit: 1,}),
    ])
    commit("saveLastCategoryData", {
      category: payload.category,
      data: data
    });

    return {"name":"respiratory","data":data.filter(e => (e && e.length>0))}
  };