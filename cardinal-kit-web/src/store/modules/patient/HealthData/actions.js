import request from "@/Rest";
import { transformHealthDataToGlobalFormat } from "@/common/helpers/healthKit";
import { metricsPaths } from "@/common/static_data/api_routes"

export const FetchSpecificTypeData = async ({ commit }, payload) => {
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  let endDate = new Date();
  if (payload.dates) {
    startDate = payload.dates.startDate;
    endDate = payload.dates.endDate;
  }
  let Ref = request.GET(
    `studies/${payload.studyId}/users/${payload.userId}/healthKit`
  );
  if (payload.dataType.includes("Quantity")) {
    Ref = Ref.WHERE(["body.quantity_type", "==", payload.dataType]);
  } else if (payload.dataType.includes("Category")) {
    Ref = Ref.WHERE(["body.category_type", "==", payload.dataType]);
  } else {
    Ref = Ref.WHERE(["body.activity_name", "==", payload.dataType]);
  }
  let RefCopy = Ref.CLONE();
  RefCopy = RefCopy.WHERE(["header.creation_date_time", ">=", startDate]);
  RefCopy = RefCopy.WHERE(["header.creation_date_time", "<=", endDate]);
  let dataSnap = await RefCopy.Execute();
  let records = [];
  records = dataSnap.docs.map((record) => {
    return transformHealthDataToGlobalFormat(record.data());
  });
  if (records.length == 0 && payload.dates == undefined) {
    //Find Last and 1 month earlier
    let NewRef = Ref.CLONE()
      .ORDER_BY("header.creation_date_time", true)
      .LIMIT(1);
    let dateSnap = await NewRef.Execute();
    if (dateSnap.docs.length > 0) {
      let endDate = dateSnap.docs[0].data().header.creation_date_time.toDate();
      let startDate = new Date(endDate);
      startDate.setDate(-30);
      Ref = Ref.WHERE(["header.creation_date_time", ">=", startDate]);
      Ref = Ref.WHERE(["header.creation_date_time", "<=", endDate]);

      let snapShot = await Ref.Execute();
      records = snapShot.docs.map((record) => {
        return transformHealthDataToGlobalFormat(record.data());
      });
    }
  }
  // if (records.length>0){
        commit("saveSpecificTypeData", { data: records, datatype: payload.dataType });
  // }
  
};

export const FetchLastCategoryData = async ({ dispatch }, payload) => {
  switch (payload.category) {
    case "activity":
      return dispatch("FetchLastActivityData", payload);
    case "body":
      return dispatch("FetchLastBodyData", payload);
    case "hearing":
      return dispatch("FetchLastHearingData", payload);
    case "heart":
      return dispatch("FetchLastHeartData", payload);
    case "mindfulness":
      return dispatch("FetchLastMindfulnessData", payload);
    case "mobility":
      return dispatch("FetchLastMobilityData", payload);
    case "nutrition":
      return dispatch("FetchLastNutritionData", payload);
    case "respiratory":
      return dispatch("FetchLastRespiratoryData", payload);
    case "sleep":
      return dispatch("FetchLastSleepData", payload);
    case "symtoms":
      return dispatch("FetchLastSymtomsData", payload);
    case "vitals":
      return dispatch("FetchLastVitalsData", payload);
    case "other":
      return dispatch("FetchLastOtherData", payload);
  }
};

export const FetchLastSurveys = async ({}, payload) => {
  let surveysSnap = await request
    .GET(`studies/${payload.studyId}/surveys`)
    .Execute();
  return {
    name: "survey",
    data: surveysSnap.docs.filter((element) => element.exists),
  };
};

export const FecthCategoryWithData = async ({ dispatch, commit }, payload) => {
  let values = await Promise.all([
    dispatch("FetchLastActivityData", payload),
    dispatch("FetchLastBodyData", payload),
    dispatch("FetchLastHearingData", payload),
    dispatch("FetchLastHeartData", payload),
    dispatch("FetchLastMindfulnessData", payload),
    dispatch("FetchLastMobilityData", payload),
    dispatch("FetchLastNutritionData", payload),
    dispatch("FetchLastRespiratoryData", payload),
    dispatch("FetchLastSleepData", payload),
    dispatch("FetchLastSymtomsData", payload),
    dispatch("FetchLastVitalsData", payload),
    dispatch("FetchLastOtherData", payload),
    dispatch("FetchLastSurveys", payload),
  ]);
  let categories = values.filter((element) => element.data.length > 0);
  let categoriesNames = categories.map((element) => {
    return element.name;
  });
  commit("saveValidCategories", categoriesNames);
};

export const FetchMetricsData = async ({ commit }, { studyId, userId }) => {
  let result = [];
  let metricSnap = await request.GET(metricsPaths.list(studyId,userId)).Execute();
  for (const [key, element] of Object.entries(metricSnap.docs)) {
    result.push(element.data());
  }
  commit("saveMetricData", result);
};
