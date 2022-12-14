// import { initialState } from "./index";

// export function RESET(state) {
//   const newState = initialState();
//   Object.keys(newState).forEach((key) => {
//     state[key] = newState[key];
//   });
// }

import { transformAppleCode,transformHealthDataToGlobalFormat } from "@/common/helpers/healthKit"

export function saveHealthData(state, payload) {
  let healthData = {};
  payload.forEach((record) => {
    Object.keys(record).forEach((key) => {
      let keyCode = "";
      let name = "";
      if (record[key].code) {
        keyCode = record[key].code.coding[0].code;
        name = record[key].code.coding[0].display;
      } else if (record[key].category) {
        keyCode = record[key].category[0].type;
        name = record[key].category[0].type;
      } else if (record[key].component) {
        keyCode = record[key].component[0].valueCodeableConcept.text;
        name = keyCode;
      } 

      if (!(keyCode in healthData)) {
        healthData[keyCode] = {
          name: name,
          code: keyCode,
          data: [],
        };
      }
      healthData[keyCode].data.push(record[key]);
    });
  });
  state.healthData = healthData;
}

export function saveLastActivityData(state, payload) {
  let activityData = {};
  let activityDataWebFormat = [];
  payload.forEach((type) => {
    if (type.length > 0) {
      activityDataWebFormat.push(transformHealthDataToGlobalFormat(type[0]))
    }
  });
  state.activityData = activityData;
  state.activityDataWebFormat = activityDataWebFormat;
}
