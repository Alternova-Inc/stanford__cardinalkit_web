import request from "@/Rest";
import { schedulePaths, usersPaths, surveysPaths, surveysUserPaths } from "@/common/static_data/api_routes"

// fetch (data and questions) all surveys in a study
export const FetchAllSurveysData = async ({ commit }, {studyId}) => {
  let response = {};
  let surveysSnap = await request.GET(surveysPaths.list(studyId)).Execute();
  await Promise.all(
    surveysSnap.docs.map(async (survey) => {      
      if (!survey.data().deleted) {
        let surveyQuestionsSnap = 
        await request.GET(surveysPaths.questionsList(studyId,survey.id)).Execute();
        let questions = {};
        surveyQuestionsSnap.forEach((question) => {
          if(!question.data().deleted)
            questions[question.id] = question.data();
        });
        response[survey.id] = {
          data: survey.data(),
          questions: questions,
        };
      }
    })
  );
  commit("saveSurveysData", {
    studyId: studyId,
    surveys: JSON.parse(JSON.stringify(response)),
  });
};

// Get all Responses of specific Survey
export const FetchSurveyDataAnswers = async (
  { commit },
  { studyId, surveyId }
) => {
  let QuestionsResults = [];
  let users = await request.GET(usersPaths.list(studyId)).Execute();
  await Promise.all(
    users.docs.map(async (user) => {
      let surveyData = await request
        .GET(surveysUserPaths.list(studyId,user.id,surveyId))
        .Execute();
      if (surveyData.exists) {
        let dataResuls = surveyData.data().results;
        dataResuls["userId"] = user.id;
        QuestionsResults.push(dataResuls);
      }
    })
  );
  commit("saveSurveyAnswers", {
    results: QuestionsResults,
    surveyId: surveyId,
    studyId: studyId,
  });
};

// Get Data,Questions of specific Survey
export const FetchSurveyData = async ({ commit }, { studyId, surveyId }) => {
  let questions = {};
  let surveyData = await request.GET(surveysPaths.get(studyId,surveyId)).Execute();
  let questionsSnap = await request.GET(surveysPaths.questionsList(studyId,surveyId)).Execute();
  questionsSnap.forEach((question) => {
    questions[question.id] = question.data();
  });
  commit("saveSurveyData", {
    data: surveyData.data(),
    questions: questions,
    surveyId: surveyId,
    studyId: studyId,
  });
};

// Get All surveys answers of specific user
export const FetchUserSurveyData = async ({ commit }, { studyId, userId }) => {
  let questionsExclude = ["summary","signature"]
  let response = {};
  //Get user answers
  let userSurveysSnap = await request.GET(surveysUserPaths.list(studyId,userId)).Execute();
  // get questions data
  await Promise.all(
    userSurveysSnap.docs.map(async (survey) => {
      let id = survey.id
      //TO CHANGE
      if(survey.data().results){
        if(survey.data().results[0]){
          id = survey.data().results[0].identifier
        }
      }
      let surveyData = await request.GET(surveysPaths.get(studyId,id)).Execute()
      

      if(surveyData.data()){
        let surveyQuestions = await request.GET(surveysPaths.questionsList(studyId,id)).Execute()
        let questions = []
        surveyQuestions.docs.map((question)=>{
          if(!questionsExclude.includes(question.data().type)){
            questions.push(question.data())
          }
        })
        if(questions.length>0){
          response[id]={
            answers:survey.data(),
            data:surveyData.data(),
            questions:questions
          }
        }
      }
    }))
  commit("saveUserAnswers", {studyId,userId, response});
};

//Create survey

export const AddSurvey = async ({ commit }, { studyId, id, questions, data }) => {
  await request
    .POST(surveysPaths.get(studyId,id), {
      data: data,
    })
    .Execute();
  Object.keys(questions).forEach(async (key) => {
    let element = questions[key];
    await request
      .POST(surveysPaths.questionGet(studyId,id,element.id), {
        data: element,
      })
      .Execute();
  });
};
// //Delete Survey question
export const DeleteSurveyQuestion = async ({ commit }, data) => {
  let studyId = data.studyId;
  await request
    .DELETE(surveysPaths.questionGet(studyId,data.name,data.id))
    .Execute();
};
//Delete Survey

export const DeleteSurvey = async ({ commit }, {studyId,surveyId}) => {
  await request.PUT(surveysPaths.get(studyId,surveyId),{
    data:{
      deleted:true
    }
  }).Execute()
};

//Scheduler

export const FetchStudyScheduler = async ({ commit }, { studyId }) => {
  let tasks = await request
    .GET(schedulePaths.list(studyId))
    .Execute();
  let taskDictionary = {};
  tasks.forEach((task) => {
    taskDictionary[task.id] = task.data();
  });
  commit("saveSchedulesByStudy", { studyId: studyId, tasks: taskDictionary });
};

export const FetchUserScheduler = async ({ commit }, { studyId, userId }) => {
  let tasks = await request
    .GET(schedulePaths.listUser(studyId,userId))
    .Execute();
  let taskDictionary = {};
  tasks.forEach((task) => {
    taskDictionary[task.id] = task.data();
  });
  commit("saveSchedulerByUser", {
    studyId: studyId,
    tasks: taskDictionary,
    userId: userId,
  });
};

export const CreateStudySchedule = async ({ commit }, { studyId, payload }) => {
  let surveysTaskId = null;
  let scheduleElements = [];
  let tasks = await request
    .GET(schedulePaths.list(studyId))
    .Execute();
  tasks.forEach((task) => {
    if (task.data().id && task.data().id == "surveys") {
      surveysTaskId = task.id;
      if (task.data().scheduleElements) {
        scheduleElements = task.data().scheduleElements;
      }
    }
  });
  scheduleElements.push(payload);
  if (surveysTaskId == null) {
    await request
      .POST(schedulePaths.list(studyId), {
        data: {
          scheduleElements: scheduleElements,
          id: "surveys",
          impactsAdherence: true,
          instructions: "Complete Daily Surveys",
          title: "Surveys",
          updateTime: new Date(),
        },
        emptyDoc: true,
      })
      .Execute();
  } else {
    await request
      .PUT(schedulePaths.get(studyId,surveysTaskId), {
        data: {
          scheduleElements: scheduleElements,
          updateTime: new Date(),
        },
      })
      .Execute();
  }
};

export const CreateUserSchedule = async (
  { commit },
  { studyId, userId, payload }
) => {
  let surveysTaskId = null;
  let scheduleElements = [];
  let tasks = await request
    .GET(schedulePaths.listUser(studyId,userId))
    .Execute();
  tasks.forEach((task) => {
    if (task.data().id && task.data().id == "surveys") {
      surveysTaskId = task.id;
      if (task.data().scheduleElements) {
        scheduleElements = task.data().scheduleElements;
      }
    }
  });
  scheduleElements.push(payload);
  if (surveysTaskId == null) {
    await request
      .POST(schedulePaths.listUser(studyId,userId), {
        data: {
          scheduleElements: scheduleElements,
          id: "surveys",
          impactsAdherence: true,
          instructions: "Complete Daily Surveys",
          title: "Surveys",
          updateTime: new Date(),
        },
        emptyDoc: true,
      })
      .Execute();
  } else {
    await request
      .PUT(
        schedulePaths.getUser(studyId,userId,surveysTaskId),
        {
          data: {
            scheduleElements: scheduleElements,
            updateTime: new Date(),
          },
        }
      )
      .Execute();
  }
};