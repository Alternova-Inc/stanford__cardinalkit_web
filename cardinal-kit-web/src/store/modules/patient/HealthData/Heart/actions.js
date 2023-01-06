import {
    FetchQuantityData,
    FetchLastQuantityData
  } from "../../index";
  
  export const FetchLastHeartData = async ({ commit }, payload) => {
    let data = await Promise.all([
      FetchLastQuantityData("HKQuantityTypeIdentifierBloodPressureSystolic", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierBloodPressureDiastolic", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierHeartRateVariabilitySDNN", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierPeripheralPerfusionIndex", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierRestingHeartRate", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierHeartRate", {...payload,limit: 1,}),
    ])
    commit("saveLastCategoryData", {
      category: payload.category,
      data: data
    });
    return {"name":"heart","data":data.filter(e => e.length>0)}
  };