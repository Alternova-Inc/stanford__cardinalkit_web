import {
    FetchLastQuantityData,
  } from "../../index";
  
  export const FetchLastNutritionData = async ({ commit }, payload) => {
    let data = await Promise.all([
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryPantothenicAcid", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietarySelenium", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietarySodium", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryThiamin", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryVitaminA", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryEnergyConsumed", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryIron", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryMagnesium", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryManganese", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryMolybdenum", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryNiacin", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryPotassium", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryProtein", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryPhosphorus", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryRiboflavin", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryFatTotal", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryCarbohydrates", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryChloride", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryChromium", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryCholesterol", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryCopper", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryFiber", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryFatSaturated", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryFatMonounsaturated", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryFatPolyunsaturated", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryBiotin", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryCaffeine", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryCalcium", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietarySugar", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryFolate", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryWater", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryIodine", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryVitaminB6", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryVitaminB12", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryVitaminC", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryVitaminD", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryVitaminE", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryVitaminK", {...payload,limit: 1,}),
      FetchLastQuantityData("HKQuantityTypeIdentifierDietaryZinc", {...payload,limit: 1,}),
    ])
    commit("saveLastCategoryData", {
      category: payload.category,
      data: data
    });
    return {"name":"nutrition","data":data.filter(e => (e && e.length>0))}
  };