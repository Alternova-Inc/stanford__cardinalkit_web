
import {FetchCategoryTypeData, FetchQuantityData, FetchSampleData,FetchLastQuantityData} from "../../index"

export function reset({ commit }) {
  commit("RESET");
}

export const FetchLastHearingData = async ({ commit }, payload) => {
  let data =await Promise.all([
    FetchSampleData("HKSampleTypeIdentifierAudiogram", {...payload,limit: 1,}),
    FetchLastQuantityData("HKQuantityTypeIdentifierEnvironmentalAudioExposure", {...payload,limit: 1,}),
  ])
  commit("saveLastCategoryData", {
    category: payload.category,
    data: data
  });
  return {"name":"hearing","data":data.filter(e => (e && e.length>0))}
};
