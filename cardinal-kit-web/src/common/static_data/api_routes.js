

const studyBasePath = `studies`
export const studiesPaths = {
    list:studyBasePath,
    get:(studyId) => `${studyBasePath}/${studyId}`
}

const userBasePath = (studyId) => `studies/${studyId}/users` 
export const usersPaths = {
    list:(studyId) => userBasePath(studyId),
    get:(studyId,userId) => `${userBasePath(studyId)}/${userId}`
}

const userRolesBasePath = `users_roles`
export const usersRolesPaths = {
    list:userRolesBasePath,
    get:(userId) => `${userRolesBasePath}/${userId}`
}

const surveysBasePath = (studyId)=> `studies/${studyId}/surveys`
export const surveysPaths = {
    list:(studyId)=>surveysBasePath(studyId),
    get:(studyId,surveyId) => `${surveysBasePath(studyId)}/${surveyId}`,
    questionsList:(studyId,surveyId) => `${surveysBasePath(studyId)}/${surveyId}/questions`,
    questionGet:(studyId,surveyId,questionId) => `${surveysBasePath(studyId)}/${surveyId}/questions/${questionId}`,
}

const surveysUserBasePath = (studyId,userId)=> `studies/${studyId}/users/${userId}/surveys`
export const surveysUserPaths = {
    list:(studyId,userId)=>surveysUserBasePath(studyId,userId),
    get:(studyId,userId,surveyId) => `${surveysUserBasePath(studyId,userId)}/${surveyId}`,
    questionsList:(studyId,userId,surveyId) => `${surveysUserBasePath(studyId,userId)}/${surveyId}/questions`,
    questionGet:(studyId,userId,surveyId,questionId) => `${surveysUserBasePath(studyId,userId)}/${surveyId}/questions/${questionId}`,
}

const scheduleBasePath = (studyId)=> `studies/${studyId}/carekit-store/v2/tasks`
const scheduleUserBasePath = (studyId,userId) => `studies/${studyId}/users/${userId}/carekit-store/v2/tasks`
export const schedulePaths = {
    list:(studyId)=>scheduleBasePath(studyId),
    get:(studyId,surveyTaskId)=>`${scheduleBasePath(studyId)}/${surveyTaskId}`,
    listUser:(studyId,userId) => `${scheduleUserBasePath(studyId,userId)}`,
    getUser:(studyId,userId,surveyTaskId) => `${scheduleUserBasePath(studyId,userId)}/${surveyTaskId}`
}

const healthKitBasePath = (studyId,userId) => `studies/${studyId}/users/${userId}/healthKit`
export const healthKitPaths = {
    list:(studyId,userId)=>healthKitBasePath(studyId,userId)
}

const healthFHIRBasePath = (studyId,userId) => `studies/${studyId}/users/${userId}/healthFhir`
export const healthFHIRPaths = {
    list:(studyId,userId)=>healthFHIRBasePath(studyId,userId)
}

const metricsBasePath = (studyId,userId) => `studies/${studyId}/users/${userId}/metrics`
export const metricsPaths = {
    list:(studyId,userId)=>metricsBasePath(studyId,userId)
}