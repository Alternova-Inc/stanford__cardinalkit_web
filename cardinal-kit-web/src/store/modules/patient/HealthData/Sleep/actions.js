import {
    FetchCategoryTypeData,
  } from "../../index";
  
  export const FetchLastSleepData = async ({ commit }, payload) => {
    let data = await Promise.all([
      FetchCategoryTypeData("HKCategoryTypeIdentifierSleepAnalysis", {...payload,limit: 1,}),
    ])
    commit("saveLastCategoryData", {
      category: payload.category,
      data: data
    });
    return {"name":"sleep","data":data.filter(e => (e && e.length>0))}
  };