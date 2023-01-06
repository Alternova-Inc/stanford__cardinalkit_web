import {
    FetchCategoryTypeData,
  } from "../../index";
  
  export const FetchLastSymtomsData = async ({ commit }, payload) => {
    let data =  await Promise.all([
      FetchCategoryTypeData("HKCategoryTypeIdentifierAppetiteChanges", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierAbdominalCramps", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierBloating", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierConstipation", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierDiarrhea", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierHeartburn", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierNausea", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierVomiting", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierChills", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierDizziness", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierFainting", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierFatigue", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierFever", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierGeneralizedBodyAche", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierHotFlashes", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierChestTightnessOrPain", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierCoughing", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierRapidPoundingOrFlutteringHeartbeat", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierShortnessOfBreath", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierSkippedHeartbeat", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierWheezing", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierLowerBackPain", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierHeadache", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierMemoryLapse", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierMoodChanges", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierLossOfSmell", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierLossOfTaste", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierRunnyNose", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierSoreThroat", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierSinusCongestion", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierBreastPain", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierPelvicPain", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierVaginalDryness", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierAcne", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierDrySkin", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierHairLoss", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierNightSweats", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierSleepChanges", {...payload,limit: 1,}),
      FetchCategoryTypeData("HKCategoryTypeIdentifierBladderIncontinence", {...payload,limit: 1,}),
    ])
    commit("saveLastCategoryData", {
      category: payload.category,
      data:data
    });
    return {"name":"symtoms","data":data.filter(e => (e && e.length>0))}
  };