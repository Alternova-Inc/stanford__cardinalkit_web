export function getAllStudies(state){
  return state.studies
}

export function getAllRecords(state){
  return state.records
}

export function getUsersStudy(state){
  return (idStudy)=>{
      return state.users[idStudy]
  }
}

export function getMonthUsage(state){
  return state.monthUserUsage
}