import request from "@/Rest";

export function reset({ commit }) {
  commit("RESET");
}

export const FetchAllStudies = async ({ commit }) => {
  let studies = [];
  const studiesSnap = await request.GET("studies").Execute();
  studiesSnap.forEach((study) => {
    studies.push({
      id: study.id,
      text: study.id,
      ...study.data(),
    });
  });
  commit("saveStudies", studies);
  return studies
};

export const FetchStudyHealthData = async ({ commit }, payload) => {
  let allRecords = [];
  const dataSnap = await request.GET(`studies/${payload.studyId}/users`).Execute();
  allRecords = await Promise.all(dataSnap.docs.map(async (user) => {
    const userSnap = await request.GET(
      `studies/${payload.studyId}/users/${user.id}/healthFhir`
    );
    const records = userSnap.docs.map((record) => {
      return record.data()
    })
    return records
  }));
  commit("saveRecords", allRecords);
};


export const FetchUsers = async ({commit},payload)=>{
  let allUsers = [];
  const usersSnap = await request.GET(`studies/${payload.studyId}/users`).Execute();
  allUsers = usersSnap.docs.map((record) => {
    return {id:record.id,...record.data()}
  })
  commit("SaveUsers", {idStudy:payload.studyId,users:allUsers})
}

export const FecthUserMonthUsage = async ({commit}, payload) => {
  let monthUsages = {}
  const usersSnap = await request.GET(`studies/${payload.studyId}/users`).Execute();

  await Promise.all(usersSnap.docs.map( async (user) => {
    let userDocs = await request.GET(`studies/${payload.studyId}/users/${user.id}/senseReliefWatchData`).Execute();
    if (userDocs.docs.length > 0) {
      let localUserUsage = {}
      userDocs.docs.forEach( (usage) => {
        const date = new Date(usage.id);
        if (date.getFullYear()>0){
          localUserUsage[`${date.getFullYear()}-${date.getMonth()}`] = true
        }
      })
      for (var key in localUserUsage){
        monthUsages[key] = monthUsages[key] != null ? monthUsages[key]+1: 1 
      }
    }
  }))
  commit("saveUsersMonthUsage", monthUsages)
}
