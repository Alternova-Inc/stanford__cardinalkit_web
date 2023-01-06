import { initialState } from "./index";

export function RESET(state) {
  const newState = initialState();
  Object.keys(newState).forEach((key) => {
    state[key] = newState[key];
  });
}

export function saveHealthData(state, payload) {
  let healthData = {}
  payload.forEach((record) => {
    Object.keys(record).forEach((key) => {
      let keyCode = ''
      let name = ''
      if (record[key].code) {
        keyCode = record[key].code.coding[0].code
        name = record[key].code.coding[0].display
      }
      else if(record[key].category){
        keyCode=record[key].category[0].type
        name=record[key].category[0].type
      }
      else if(record[key].component){
        keyCode=record[key].component[0].valueCodeableConcept.text
        name=keyCode
      }
      else{
      }

      if(!(keyCode in healthData)){
        healthData[keyCode]={
          'name':name,
          'code':keyCode,
          'data': []
        }
      }
      healthData[keyCode].data.push(record[key])
    });
  });
  state.healthData = healthData;
}
