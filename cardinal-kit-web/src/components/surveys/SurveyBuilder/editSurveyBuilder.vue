<template>
  <div  id="app">
    <div class="wrapper" v-if="surveys">
      <div class="input-form">
        <div :class="cl" v-if="errMsg">
          {{msg}}
        </div>
        <h1>Edit Surveys Builder</h1>
        <br />
        <label>Enter the title: </label>
        <input v-model="surveys.title" type="text" placeholder="Title" />
        <br>
        <label>Enter the subtitle: </label>
        <input v-model="surveys.subtitle" type="text" placeholder="Subtitle" />
        <br>
        <label class="my-4">Show on main screen: </label>
        <input v-model="surveys.main" type="checkbox" />
        <br />
        <label>Order: </label>
        <input v-model="surveys.order" type="number"  min="1" pattern="^[0-9]+"/>
        <br>
        <label>Section: </label>
        <input v-model="surveys.section" type="text" placeholder="Section" />
        <!-- <br>
        <label>Icon: </label>
        <input type="file" placeholder="Icon" accept="image/*" /> -->
        <br>
        <div v-for="question in newQuestionsData" :key="question.id">
          <Question :disabledSelect="question.disabled" :question="question" @DeleteQuestion="deleteQuestions" :ref="question.id"/>
        </div>
        <br />
        <div class="form-group">
          <button @click="addQuestion" type="button" class="btn btn-secondary">
            Add question
          </button>
        </div>
        <div class="form-group">
          <button @click="updateSurvey" type="button" class="btn btn-primary">
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Question from "@/components/surveys/SurveyBuilder/Questions";
import { mapActions, mapGetters } from "vuex";
import store from "@/store";
import { uuidv4 } from "@/helpers";
import Swal from 'sweetalert2'

export default {
  name: "App",
  props: {
    studyId: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      surveyId: this.$route.params.surveyId,
      image: null,
      section: "",
      subtitle: "",
      title: "",
      scopeTypes: ["Public", "Private"],
      surveyName: "",
      orderQuestion:0,
      order:"",
      main: null,
      surveys: {},
      surveyData:null,
      questionData: {},
      newQuestionsData:{},
      errMsg: false,
      msg: "",
      cl:""
    }
  },
  components: {
    Question,
  },
  methods: {
    ...mapActions("surveys", ["DeleteSurveyQuestion", "AddSurvey","DeleteSurvey"]),
    addQuestion() {
      this.orderQuestion+=1
      let id = uuidv4()
      this.newQuestionsData[id]={
        title: "",
        id: id,
        type: "",
        scope: "public",
        identifier: "",
        readonly: false,
        description: "",
        question: [],
        required: true,
        options: [],
        order:""+this.orderQuestion
      }
    },
    deleteQuestions(index) {
      this.DeleteSurveyQuestion({...this.newQuestionsData[index],
       name: this.surveyId,
       studyId: this.studyId
      }).then(() => {
        delete this.questionData[index]
        delete this.newQuestionsData[index]
      })
    },
    saveSurvey(data){
      this.errMsg = false 
      this.DeleteSurvey({ surveyId: this.surveyId, studyId: this.studyId })
      .then(() => {
        let id = uuidv4()
        data['identifier'] = id
        this.AddSurvey({
          id: id,
          studyId: this.studyId,
          questions: this.newQuestionsData,
          data: data,
        }).then(()=>{
          this.errMsg = true
          this.msg="Surveys Builder has been created successfully"
          this.cl= "alert-success"
          Swal.fire({
            title: 'success',
            text:   "Surveys Builder has been created successfully",
            icon: 'success'
          }).then(()=>{
            this.$router.push(`/surveysList/${this.studyId}`)
          })
        }) 
      })
    },
    validSurvey(questions, data){
      // review if question has data
      let isValid = true
      for(const[key,value] of Object.entries(questions)){
        if(!this.$refs[value.id].reviewQuestionData()){
          isValid = false
        }
      }
      if(isValid){
        this.saveSurvey(data)
      }
      else{
        this.errMsg = true
        this.cl = "alert-err"
        this.msg="Some data is incorrect"
      }
    },
    updateSurvey(){
      this.errMsg = false
      this.msg=""
      if (
        this.surveys.title && 
        this.surveys.subtitle && 
        this.surveys.order && 
        this.surveys.section
      ){
        let surveyData={
          'image':"SurveyIcon",
          'order':this.surveys.order,
          'section':this.surveys.section,
          'subtitle':this.surveys.subtitle,
          'title':this.surveys.title,
          'main': this.surveys.main
        }
        if (Object.keys(this.newQuestionsData).length){
            let questionIdentifiers = Object.keys(this.newQuestionsData).map((key)=>{
            return this.newQuestionsData[key].identifier
          }) 
            let uniqueIdentifiers =new Set(questionIdentifiers)
          if(questionIdentifiers.length==uniqueIdentifiers.size){
            this.validSurvey(this.newQuestionsData, surveyData)
          }
          else{
            this.errMsg = true
            this.cl = "alert-err"
            this.msg = "The question identifiers must be unique"
          }
        }else{
          this.errMsg = true
          this.cl = "alert-err"
          this.msg = "The questions cannot be empty"
        }
      } else {
        this.errMsg = true
        this.cl = "alert-err"
        this.msg = "The fields can't be blank"
      }
    }, 
    setSurveyData(){      
      this.surveyData = this.getSurveysData(this.studyId)[this.surveyId]
      if (this.surveyData) {
        let data= this.surveyData.data
        this.surveys={
          'image':data.image,
          'order':data.order,
          'section':data.section,
          'subtitle':data.subtitle,
          'title':data.title,
          'main': data.main
        }
        let questions = this.surveyData.questions
        if(questions){
          for (const [key, value] of Object.entries(questions)){
            this.questionData[value.id]={...value, readonly: true, disabled: true}
          }
        }
        this.newQuestionsData = {...this.questionData}
      }
    }
  },
  computed: {
      ...mapGetters("surveys",["getSurveysData"])
  },
  created(){
    this.setSurveyData()
  },
  beforeRouteEnter(to, from, next) {
    Promise.all([
      store.dispatch("surveys/FetchSurveyData", {
        studyId: to.params.studyId,
        surveyId: to.params.surveyId
      }),
    ])
    .then(() => {
      next();
    });
  }
};
</script>

<style lang="scss">
.wrapper {
  margin-top: 5%;
  margin-bottom: 5%;
}
.input-form{
  margin: auto;
  width: 60%;
}
.surveys > div {
  margin: 10px 0;
  padding-bottom: 10px;
}
.btn {
  color: black;
  background: transparent;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
  border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.btn-secondary {
  text-decoration: none;
  color: black;
  border-color: #000000;
  background: #b71540;
}
.btn-terceary {
  text-decoration: underline;
  color: black;
  border-color: #000000;
  background: transparent;
}
</style>
