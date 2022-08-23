<template>
<div>
    <label>Min: </label>
      <input
        v-model="Options.min"
        :name="`options[${Options.id}]`"
        type="number"
        class="TextInput"
        placeholder="1"
        min="0"
        :class="classError('min')"        
      />
      <label>Max: </label>
      <input
        v-model="Options.max"
        :name="`options[${Options.id}]`"
        type="number"
        class="TextInput"
        placeholder="1"
        min="0"
        :class="classError('max')"
      />
      <label>maxFractionDigits: </label>
      <input
        v-model="Options.maxFractionDigits"
        :name="`options[${Options.id}]`"
        type="number"
        class="TextInput"
        placeholder="1"
        min="0"
        :class="classError('maxFraction')"
      />
      <label>Unit: </label>
      <input
        v-model="Options.unit"
        :name="`options[${Options.id}]`"
        type="text"
        class="TextInput"
        placeholder="meters"
        :class="classError('unit')"
      />
</div>
</template>

<script>
export default {
  props: {
    Options: Object
  },
  data:() => ({
    errors:{}
  }),
  methods:{
    classError(value){
      if(this.errors[value]){
        return "TextInput input-no-value-style"
      }
      return "TextInput"
    },
    checkQuestion(){
      this.errors={}
      let error = false
      let msg = ""

      if(this.Options.min == "" || this.Options.max == "" || this.Options.maxFractionDigits == "" || this.Options.unit == ""){
        error = true
        msg = "The fields can't be blank"        
        this.errors['min']=this.Options.min==""
        this.errors['max']=this.Options.max==""
        this.errors['maxFraction']=this.Options.maxFractionDigits==""
        this.errors['unit']=this.Options.unit==""

      }
      else{
        let min = parseInt(this.Options.min)
        let max = parseInt(this.Options.max)

        if(min>max){
          error = true 
          msg = "Min value must be lower than max value"

          this.errors['min']=true

        }
      }
      return {"error":error,"msg":msg};
    }
  }
};
</script>

<style>
</style>