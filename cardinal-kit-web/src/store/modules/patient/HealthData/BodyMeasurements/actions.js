import {
  FetchQuantityData,
  FetchLastQuantityData
} from "../../index";

export const FetchLastBodyData = async ({ commit }, payload) => {
  let data = await Promise.all([
    FetchLastQuantityData("HKQuantityTypeIdentifierBasalBodyTemperature", {...payload,limit: 1,}),
    FetchLastQuantityData("HKQuantityTypeIdentifierBodyFatPercentage", {...payload,limit: 1,}),
    FetchLastQuantityData("HKQuantityTypeIdentifierLeanBodyMass", {...payload,limit: 1,}),
    FetchLastQuantityData("HKQuantityTypeIdentifierBodyTemperature", {...payload,limit: 1,}),
    FetchLastQuantityData("HKQuantityTypeIdentifierBodyMass", {...payload,limit: 1,}),
    FetchLastQuantityData("HKQuantityTypeIdentifierBodyMassIndex", {...payload,limit: 1,}),
    FetchLastQuantityData("HKQuantityTypeIdentifierElectrodermalActivity", {...payload,limit: 1,}),
    FetchLastQuantityData("HKQuantityTypeIdentifierHeight", {...payload,limit: 1,}),
    FetchLastQuantityData("HKQuantityTypeIdentifierWaistCircumference", {...payload,limit: 1,}),
  ])
  commit("saveLastCategoryData", {
    category: payload.category,
    data: data
  });
  return {"name":"body","data":data.filter(e => (e && e.length>0))}
};