<template>
  <form>
    <div class="alert-err" v-if="error">
      {{msg}}
    </div>
    <div class="surveys">
      <div class="form-group col-md-6">
        <label>Select the type of question: </label>
        <br />
        <br />
        <AltSelect
          :disabledSelect="disabledSelect"
          :defaultValue="question.type"
          :ref="question.id"
          :options="questionTypes"
          v-model="question.type"
          :name="`surveys[${question.id}][type]`"
          type="text"
          class="form-control"
          placeholder="Type of question"
          :onChange="() => {
              createQuestionOptions(question.type, question.id);
            }"
        />
        <br />
      </div>
      <div
        v-if="question.type != '' && question.type != null"
        class="form-group col-md-6"
      >
        <label>Title: </label>
        <input
          v-model="question.title"
          :name="`surveys[${question.id}][title]`"
          type="text"
          placeholder="Title"
          :class="classError('title')"
        />
      </div>
      <div
        v-if="question.type != '' && question.type != null"
        class="form-group col-md-6"
      >
        <label>Identifier: </label>
        <input
          v-model="question.identifier"
          :name="`surveys[${question.id}][identifier]`"
          type="text"
          placeholder="Identifier"
          :readonly="question.readonly"
          :class="classError('identifier')"
        />
      </div>
      <div
        v-if="question.type != '' && question.type != null"
        class="form-group col-md-6"
      >
        <label>Description: </label>
        <input
          v-model="question.description"
          :name="`surveys[${question.id}][description]`"
          type="text"
          placeholder="Description here..."
          :class="classError('description')"
        />
      </div>

      <div v-if="question.type != '' && question.type != null">
        <input
          type="checkbox"
          v-model="question.required"
          :name="`surveys[${question.id}][required]`"
          hidden
        />
      </div>

      <div
        v-if="
          question.type != '' &&
          question.type != null &&
          question.type != 'form' &&
          question.type != 'instruction'
        "
        class="form-group col-md-6"
      >
        <br />
        <label>Question: </label>
        <input
          v-model="question.question"
          :name="`
              surveys[${question.id}][question]`"
          type="text"
          class="TextInput"
          placeholder="Question"
          :class="classError('question')"
        />
      </div>

      <div v-if="question.type == 'form'">
        <Form :Survey="question" ref="question"/>
      </div>

      <div v-if="question.type === 'scale'" class="form-group col-md-6">
        <Scale :Options="question" ref="question"/> 
      </div>

      <div v-if="question.type === 'continuosScale'" class="form-group col-md-6">
        <ContinuosScale :Options="question" ref="question"/>
      </div>

      <div v-if="question.type === 'picker'" class="form-group col-md-6">
        <Picker :Options="question.options" ref="question"/>
      </div>

      <div v-if="question.type === 'boolean'" class="form-group col-md-6">
        <Boolean :Options="question" ref="question"/>
      </div>

      <div v-if="question.type === 'singleChoice'" class="form-group col-md-6">
        <br />
        <Radio :Options="question.options" ref="question"/>
      </div>

      <div v-if="question.type === 'multipleChoice'" class="form-group col-md-6">
        <br />
        <Checkbox :Options="question.options" ref="question"/>
      </div>

      <div v-if="question.type === 'instruction'" class="form-group col-md-6">
        <br />
        <Instruction :Options="question.options" ref="question"/>
      </div>

      <div v-if="question.type === 'text'" class="form-group col-md-6">
        <br />
        <Text ref="question"/>
      </div>

      <div v-if="question.type === 'textarea'" class="form-group col-md-6">
        <br />
        <TextArea ref="question"/>
      </div>

      <div v-if="question.type === 'signature'" class="form-group col-md-6">
        <br />
        <Signature ref="question"/>
      </div>

      <div v-if="question.type === 'date'" class="form-group col-md-6">
        <br />
        <Date ref="question"/>
      </div>

      <div v-if="question.type === 'decimal'" class="form-group col-md-6">
        <br />
        <Decimal ref="question"/>
      </div>

      <div v-if="question.type === 'email'" class="form-group col-md-6">
        <br />
        <Email ref="question"/>
      </div>

      <div v-if="question.type === 'height'" class="form-group col-md-6">
        <br />
        <Height ref="question"/>
      </div>

      <div v-if="question.type === 'numeric'" class="form-group col-md-6">
        <br />
        <Integer :Options="question" ref="question"/>
      </div>

      <div v-if="question.type === 'location'" class="form-group col-md-6">
        <br />
        <Location ref="question"/>
      </div>

      <div v-if="question.type === 'socioeconomic'" class="form-group col-md-6">
        <br />
        <SocioEconomic :Options="question" ref="question"/>
      </div>

      <div v-if="question.type === 'textScale'" class="form-group col-md-6">
        <br />
        <TextScale :Survey="question"  ref="question"/>
      </div>

      <div v-if="question.type === 'timeinterval'" class="form-group col-md-6">
        <br />
        <TimeInterval ref="question"/>
      </div>

      <div v-if="question.type === 'timeofday'" class="form-group col-md-6">
        <br />
        <TimeOfDay ref="question"/>
      </div>

      <div v-if="question.type === 'weight'" class="form-group col-md-6">
        <br />
        <Weight ref="question"/>
      </div>
      <div v-if="question.type === 'summary'" class="form-group col-md-6" >
        <br />
        <Summary ref="question"/>
      </div>

      <br />
      <br />

      <button
        @click="
          () => {
            deleteQuestion(question.id);
          }
        "
        type="button"
      >
        Delete Question
      </button>
      <br />
      <br />
      <hr />
    </div>
  </form>
</template>

<script>
import AltSelect from "@/components/multiSelect/Select";
import Summary from "@/components/surveys/SurveyBuilder/questionsTypes/Summary";
import Form from "@/components/surveys/SurveyBuilder/questionsTypes/Form";
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
import ContinuosScale from "@/components/surveys/SurveyBuilder/questionsTypes/ContinuosScale.vue"
import Picker from "@/components/surveys/SurveyBuilder/questionsTypes/Picker.vue"
import CheckBoxVue from './questionsTypes/CheckBox.vue';

export default {
  props: ["question", "disabledSelect"],
  components: {
    AltSelect,
    Picker,
    Form,
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
    Weight,
    ContinuosScale,
    Summary
  },

  data: () => ({
    errors:{},
    error:false,
    msg: "",
    questionTypes: [
      "text",
      "textarea",
      "singleChoice",
      "multipleChoice",
      "form",
      "scale",
      "boolean",
      "instruction",
      "signature",
      "date",
      "numeric",
      "email",
      "location",
      "textScale",
      "timeInterval",
      "timeOfDay",
      "height",
      "weight",
      "socioeconomic",
      "continuosScale",
      "picker",
      "summary"
    ],
    questionValues: [],
  }),
  methods: {
    classError(value){
      if(this.errors[value]){
        return "TextInput input-no-value-style"
      }
      return "TextInput"
    },
    createQuestionOptions(type, id) {
      switch (type) {
        case "singleChoice":
          this.question.type = "singleChoice";
          if (!this.question.options.length){
            this.question.options = [
              { text: "", value: "0" },
              { text: "", value: "1" },
            ];
          }
          break;
        case "multipleChoice":
          this.question.type = "multipleChoice";
          if (!this.question.options.length){
            this.question.options = [
              { text: "", value: "0" },
              { text: "", value: "1" },
            ]; 
          }
          break;
        case "boolean":
          !this.question['yes'] ? this.question['yes'] = "" : this.question
          !this.question['no'] ? this.question['no'] = "" : this.question
          break;
        case "scale":
          !this.question["min"] ? this.question["min"] = "" : this.question
          !this.question["minValueDescription"] ? this.question["minValueDescription"] = "" : this.question
          !this.question["max"] ? this.question["max"] = "" : this.question
          !this.question["maxValueDescription"] ? this.question["maxValueDescription"] = "" : this.question
          !this.question["step"] ? this.question["step"] = "" : this.question
          !this.question["default"] ? this.question["default"] = "" : this.question
          !this.question["vertical"] ? this.question["vertical"] = false  : this.question
          break;
        case "textScale":
          !this.question["defaultIndex"] ? this.question["defaultIndex"] = "" : this.question
          break;
        case "numeric":
          !this.question["max"] ? this.question["max"] = "" : this.question
          !this.question["min"] ? this.question["min"] = ""  : this.question
          !this.question["maxFractionDigits"] ? this.question["maxFractionDigits"] = "" : this.question
          !this.question["unit"] ? this.question["unit"] = "" : this.question
          break;
        case "continuosScale":
          !this.question["min"] ? this.question["min"] = "" : this.question
          !this.question["minValueDescription"] ? this.question["minValueDescription"] = "" : this.question
          !this.question["max"] ? this.question["max"] = "" : this.question
          !this.question["maxValueDescription"] ? this.question["maxValueDescription"] = "" : this.question
          !this.question["default"] ? this.question["default"] = "" : this.question
          !this.question["maxFractionDigits"] ? this.question["maxFractionDigits"]="" : this.question
          !this.question["vertical"] ? this.question["vertical"] = false : this.question
          break;
        case "socioeconomic":
          !this.question["topText"] ? this.question["topText"] = "" : this.question
          !this.question["bottomText"] ? this.question["bottomText"] = "" : this.question
          break;
        
        case "picker":
          if (!this.question.options.length){
            this.question.options = [
              { text: "", value: "0" },
              { text: "", value: "1" },
            ];
          }
          break;
        default:
          if (!this.question.options || !this.question.options.length){
            this.question["options"] = [{}];
          }
          break;
      }
    },
    deleteQuestion(index) {
     this.$emit("DeleteQuestion", index);
    },
    reviewQuestionData(){
      this.errors={}
      if(this.$refs["question"]){
        let error,msg;
        ({error,msg} = this.$refs["question"].checkQuestion())
        this.error =  error
        this.msg = msg

        if(this.question.title == "" || this.question.identifier == "" || this.question.description == "" ){
          this.errors["title"]=this.question.title == "" 
          this.errors["identifier"]=this.question.identifier == "" 
          this.errors["description"]=this.question.description == "" 
          this.error = true
         
          this.msg = "The fields can't be blank"

        }

        if(this.question.type != "form" && this.question.question == ""){
          this.error = true
          this.msg = "The fields can't be blank"
          this.errors["question"] = true
        }
      }
      else{
          this.error = true
          this.msg = "Select the type of question"
      }
      
      return !this.error
    }
  }
 };
</script>

<style lang="scss">
.CheckBoxInput {
  margin: 0px 10px 0px 10px;
  width: 15px;
  height: 15px;
}
.TextInput {
  margin: 0px 0px 0px 0px;
}

/* Form element setup */
form {

  margin: 2rem 0;
  z-index: 1;
}

fieldset {
  margin: 0 0 1rem 0;
  padding: 0;
  border: none;
}

legend {
  font-weight: 400;
}

legend,
label {
  display: inline-block;
  margin-bottom: .5rem;
}


input[type='text'],
input[type='email'],
textarea,
select {
  display: block;
  padding: .5rem;
  width: 100%;
  background-color: transparent;
  border-radius: .25rem;
  border: 1.5px solid #6c757d7d;//#e5e5e5;
  outline: none;
      
  /* List some properties that might change */
  transition-property: none;
  transition-duration: none;
  
  &:focus {
    border-color: rgb(239,126,173);
  }
}
input[type='text'],
input[type='email'],
select {
  height: 34px;
  border: 0px;
  border-radius: 0px;
  border-bottom: 1px solid #7F7F7F;
}

textarea {
  max-width: 300px;
  height: 100px;
}



input[type='number'],
input[type='time'],
select {
  display: block;
  padding: .5rem;
  width: 30%;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #b9b9ba;
  outline: none;
  transition-property: none;

  &:focus {
    border-bottom: 1px solid rgb(255,150,200);
  }
}

select {
  font-size: .875rem;
}

input[type='checkbox'],
input[type='radio'] {
  position: relative;
  top: 5px;
  width: 22px;
  height: 22px;
  margin: 0 .5rem;
  background-color: white;
  border: 1px solid #e5e5e5;
  outline: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  
  /* List some properties that might change */
  transition-property: none;
  transition-duration: none;
}

input[type='checkbox'] {
  border-radius: 5px;

  &:checked {
    background-color: rgb(239,126,173); 
    border: none;

    &:after {
      display: block;
      content: '';
      height: 4px;
      width: 10px;
      border-bottom: 3px solid #fff;
      border-left: 3px solid #fff;
      transform: translate(5px,6px) rotate(-45deg) scale(1);
    }
  }
}

input[type='radio'] {
  border-radius: 50%;
  
  &:checked {
    border-width: 5px;
    border-color: white;
    background-color: rgb(239,126,173);
  }
}

button {
  display: block;
  padding: .5rem 2rem;
  font-size: 125%;
  color: white;
  border: none;
  margin: auto;
  border-radius: .25rem;
  background-color: rgb(239,126,173);
  outline: none;
  box-shadow: 0 .4rem .1rem -.3rem rgba(0,0,0,.1);

  /* We'll talk about this next */
  transform: perspective(300px) scale(.95) translateZ(0);
  transform-style: preserve-3d;

  /* List the properties that you're looking to transition.
     Try not to use 'all' */
  transition-property: none;

  /* This applies to all of the above properties */
  transition-duration: none;
    
  &:hover {
    cursor: pointer;
    background-color: rgb(255,150,200);
    box-shadow: 0 0 0 0 rgba(0,0,0,0);
    transform: scale(1.1) rotateX(0);
  }

  &:active {
    background-color: rgb(239,126,173);
    transform: scale(1.05) rotateX(-10deg);
  }
}
</style>