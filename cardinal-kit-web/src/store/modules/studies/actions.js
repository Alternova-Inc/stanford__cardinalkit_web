import request from "@/Rest";
import { studiesPaths, usersPaths, healthFHIRPaths } from "@/common/static_data/api_routes"

export function reset({ commit }) {
  commit("RESET");
}

export const FetchAllStudies = async ({ commit }) => {
  let studies = [];
  const studiesSnap = await request.GET(studiesPaths.list()).Execute();
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
  const dataSnap = await request.GET(usersPaths.list(payload.studyId)).Execute();
  allRecords = await Promise.all(dataSnap.docs.map(async (user) => {
    const userSnap = await request.GET(
      healthFHIRPaths.list(payload.studyId,user.id)
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
  const usersSnap = await request.GET(usersPaths.list(payload.studyId)).Execute();
  allUsers = usersSnap.docs.map((record) => {
    return {id:record.id,...record.data()}
  })
  commit("SaveUsers", {idStudy:payload.studyId,users:allUsers})
}

