<template>
  <form>
    <div class="Form">
        <br />
        <br />
      <div class="form-row" v-for="(question, index) in Survey.question" :key="index">
        <div class="form-group col-md-6">
          <label>Select the type of question: </label>
          <br />
          <br />
          <AltSelect
            :defaultValue="question.type"
            :options="formQuestionTypes"
            v-model="question.type"
            :name="`questions[${index}][type]`"
            type="text"
            class="form-control"
            placeholder="Type of question"
            :onChange="
              () => {
                createFormQuestionOptions(question.type, index);
              }
            "
          />
          <br />
        </div>
        <div
          v-if="question.type != '' && question.type != null"
          class="form-group col-md-6"
        >
          <label>Identifier: </label>
          <input
            v-model="question.identifier"
            :name="`questions[${index}][id]`"
            type="text"
            class="TextInput"
            placeholder="id"
            :class="classError(question.id+'identifier')" 
          />
        </div>

        <div
          v-if="question.type != '' && question.type != null"
        >
          <input            
            type="checkbox"
            v-model="question.required"
            :name="`questions[${index}][required]`"
            hidden
          />
        </div>      

        <div
          v-if="question.type != '' && question.type != null && question.type != 'form' && question.type != 'instruction'"
          class="form-group col-md-6"
        >
          <br />
          <label>Question: </label>
          <input
            
            v-model="question.question"
            :name="`
               questions[${index}][question]`"
            type="text"
            class="TextInput"
            placeholder="Question"
            :class="classError(question.id+'question')"
          />
        </div>

        <div v-if="question.type === 'scale'" class="form-group col-md-6">
          <Scale :Options="question"  :ref="question.id"/>
        </div>

        <div v-if="question.type === 'boolean'" class="form-group col-md-6">
          <Boolean :Options="question" :ref="question.id"/>
        </div>

        <div v-if=" question.type === 'singleChoice' " class="form-group col-md-6" >
          <br />
          <Radio :Options="question.options" :ref="question.id"/>
        </div>

        <div v-if=" question.type === 'multipleChoice' " class="form-group col-md-6" >
          <br />
          <Checkbox :Options="question.options" :ref="question.id"/>
        </div>

        <div v-if=" question.type === 'instruction' " class="form-group col-md-6" >
          <br />
          <Instruction :Options="question.options" :ref="question.id"/>
        </div>

        <div v-if=" question.type === 'text' " class="form-group col-md-6" >
          <br />
          <Text :ref="question.id"/>
        </div>

        <div v-if=" question.type === 'textarea' " class="form-group col-md-6" >
          <br />
          <TextArea :ref="question.id"/>
        </div>

        <div v-if=" question.type === 'signature' " class="form-group col-md-6" >
          <br />
          <Signature :ref="question.id"/>
        </div>

        <div v-if="question.type === 'date'" class="form-group col-md-6">
          <br />
          <Date :ref="question.id"/>
        </div>

        <div v-if="question.type === 'decimal'" class="form-group col-md-6">
          <br />
          <Decimal :ref="question.id"/>
        </div>

        <div v-if="question.type === 'email'" class="form-group col-md-6">
          <br />
          <Email :ref="question.id"/>
        </div>

        <div v-if="question.type === 'height'" class="form-group col-md-6">
          <br />
          <Height :ref="question.id"/>
        </div>

        <div v-if="question.type === 'integer'" class="form-group col-md-6">
          <br />
          <Integer :ref="question.id"/>
        </div>

        <div v-if="question.type === 'location'" class="form-group col-md-6">
          <br />
          <Location :ref="question.id"/>
        </div>

        <div v-if="question.type === 'socioeconomic'" class="form-group col-md-6">
          <br />
          <SocioEconomic :ref="question.id"  :Options="question.options"/>
        </div>

        <div v-if="question.type === 'textscale'" class="form-group col-md-6">
          <br />
          <TextScale :ref="question.id"/>
        </div>

        <div v-if="question.type === 'timeinterval'" class="form-group col-md-6">
          <br />
          <TimeInterval :ref="question.id"/>
        </div>

        <div v-if="question.type === 'timeofday'" class="form-group col-md-6">
          <br />
          <TimeOfDay :ref="question.id"/>
        </div>

        <div v-if="question.type === 'weight'" class="form-group col-md-6">
          <br />
          <Weight :ref="question.id"/>
        </div>

        <br />
        <br />

        <button
          @click="
            () => {
              deleteFormQuestion(index);
            }
          "
          type="button"
        >
          Delete Form Question
        </button>
        <br />
        <br />
        <hr />
      </div>
      <div class="form-group">
        <button @click="addFormQuestion" type="button" class="btn btn-secondary">
          Add Form Question
        </button>
      </div>
    </div>
  </form>
</template>

<script>

import Checkbox from "@/components/surveys/SurveyBuilder/questionsTypes/CheckBox";
import Radio from "@/components/surveys/SurveyBuilder/questionsTypes/Radio";
import Scale from "@/components/surveys/SurveyBuilder/questionsTypes/Scale";
import Instruction from "@/components/surveys/SurveyBuilder/questionsTypes/Instruction";
import Text from "@/components/surveys/SurveyBuilder/questionsTypes/Text";
import TextArea from "@/components/surveys/SurveyBuilder/questionsTypes/TextArea";
import Signature from "@/components/surveys/SurveyBuilder/questionsTypes/Signature";
import Boolean from "@/components/surveys/SurveyBuilder/questionsTypes/Boolean";
import Date from "@/components/surveys/SurveyBuilder/questionsTypes/Date";
import Decimal from "@/components/surveys/SurveyBuilder/questionsTypes/Decimal";
import Email from "@/components/surveys/SurveyBuilder/questionsTypes/Email";
import Height from "@/components/surveys/SurveyBuilder/questionsTypes/Height";
import Integer from "@/components/surveys/SurveyBuilder/questionsTypes/Integer";
import Location from "@/components/surveys/SurveyBuilder/questionsTypes/Location";
import SocioEconomic from "@/components/surveys/SurveyBuilder/questionsTypes/SocioEconomic";
import TextScale from "@/components/surveys/SurveyBuilder/questionsTypes/TextScale";
import TimeInterval from "@/components/surveys/SurveyBuilder/questionsTypes/TimeInterval";
import TimeOfDay from "@/components/surveys/SurveyBuilder/questionsTypes/TimeOfDay";
import Weight from "@/components/surveys/SurveyBuilder/questionsTypes/Weight";
import AltSelect from "@/components/multiSelect/Select";
import { uuidv4 } from "@/helpers";

export default {
  props: {
    Survey: Object,
  },
  components: {
    AltSelect,
    Checkbox,
    Radio,
    Scale,
    Instruction,
    Text,
    TextArea,
    Signature,
    Boolean,
    Date,
    Decimal,
    Email,
    Height,
    Integer,
    Location,
    SocioEconomic,
    TextScale,
    TimeInterval,
    TimeOfDay,
    Weight
  },

  data: () => ({
    errors:{},
    formQuestionTypes: [
      "text",
      "textarea",
      "singleChoice",
      "multipleChoice",
      "scale",
      "boolean",
      "instruction",
      "signature",
      "date",
      "numeric",
      "email",
      "location",
      "textScale",
      "timeinterval",
      "timeofday",
      "height",
      "weight",
      "socioeconomic"
    ],
  }),

  methods: {
    classError(value){
      if(this.errors[value]){
        return "TextInput input-no-value-style"
      }
      return "TextInput"
    },
    addFormQuestion() {
      if(!this.Survey.question){
        this.Survey.question=[]
      }
      this.Survey.question.push({
        id: uuidv4(),
        type: "",
        scope: "public",
        identifier: "",
        description: "",
        question: "",
        required: true,
        options: [],
      });
    },

    deleteFormQuestion(index) {
      this.Survey.question.splice(index, 1);
    },

    createFormQuestionOptions(type, index) {
      switch (type) {
        case 'singleChoice':
          this.Survey.question[index].type = "singleChoice"
          this.Survey.question[index].options = [
            { text: "", value: 0 },
            { text: "", value: 1 },
          ];
          break;
        case 'multipleChoice':
          this.Survey.question[index].type = "multipleChoice"
          this.Survey.question[index].options = [
            { text: "", value: 0 },
            { text: "", value: 1 },
          ];
          break;
        case "boolean":
          this.Survey.question[index].yes = "" 
          this.Survey.question[index].no = "" 
          break;
        case "scale":
         this.Survey.question[index].min = ""
         this.Survey.question[index].minValueDescription = ""
         this.Survey.question[index].max = ""
         this.Survey.question[index].maxValueDescription = ""
         this.Survey.question[index].step = ""
         this.Survey.question[index].default = ""
         this.Survey.question[index].vertical = false
          break;
        default:
          this.Survey.question[index].options = [{}];
          if (!this.Survey.question[index].options || !this.Survey.question[index].options.length){
            this.Survey.question[index].options  = [{}];
          }
          break;
      }
    },
    placeholderSetter(index) {
      return "Option " + (index + 1);
    },
    checkQuestion(){
      this.errors = {}
      let isValid = true
      let msg = ""
      for(const [key,value] of Object.entries(this.Survey.question)){
        if(value.question == "" || value.identifier == ""){
          isValid = false
          msg = "The fields can't be blank"
          this.errors[value.id+'question']= value.question==""
          this.errors[value.id+'identifier']=value.identifier==""
        }
        if(!this.$refs[value.id]  || !this.$refs[value.id].checkQuestion()){

          isValid=false
          msg = "The fields can't be blank"
        }
      }
      if(this.Survey.question.length==0){
        isValid=false
        msg = "Please select at least one question "
      }
      return {"error":!isValid,"msg":msg};
    }
  },
};
</script>

<style>
</style>