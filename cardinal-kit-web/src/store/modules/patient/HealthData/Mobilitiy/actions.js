import {
  FetchLastQuantityData,
  } from "../../index";
  
  export const FetchLastMobilityData = async ({ commit }, payload) => {
    let data =  await Promise.all([
      FetchLastQuantityData("HKQuantityTypeIdentifierWalkingDoubleSupportPercentage", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierStairDescentSpeed", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierStairAscentSpeed", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierWalkingSpeed", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierSixMinuteWalkTestDistance", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierwalkingAsymmetryPercentage", {...payload,limit: 1,}),
    ])
    commit("saveLastCategoryData", {
      category: payload.category,
      data: data
    });

    return {"name":"mobility","data":data.filter(e => (e && e.length>0))}
  };