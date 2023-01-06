import { FetchQuantityData, FetchCategoryTypeData } from "../../index";

export const FetchLastMindfulnessData = async ({ commit }, payload) => {
  let data = await Promise.all([
    FetchCategoryTypeData("HKCategoryTypeIdentifierMindfulSession", {...payload,limit: 1,}),
  ])
  commit("saveLastCategoryData", {
    category: payload.category,
    data: data
  });
  return {"name":"mindfulness","data":data.filter(e => (e && e.length>0))}
};
