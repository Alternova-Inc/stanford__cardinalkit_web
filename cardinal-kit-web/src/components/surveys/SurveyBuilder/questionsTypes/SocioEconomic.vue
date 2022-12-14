<template>
  <div>
    <label>Top Text: </label>
        <input
          v-model="Options.topText"
          :name="`options[${Options.id}]`"
          type="text"
          placeholder="A"
          :class="classError('min')"
        />
        <label>Bottom Text: </label>
        <input
          v-model="Options.bottomText"
          :name="`options[${Options.id}]`"
          type="text"
          placeholder="E"
          :class="classError('max')"
        />
  </div>
</template>

<script>
export default {
  data:() => ({
    errors:{}
  }),
  props: {
    Options: Object
  },
  methods:{
    classError(value){
      if(this.errors[value]){
        return "TextInput input-no-value-style"
      }
      return "TextInput"
    },
    checkQuestion(){
      let error = false
      let msg = ""
      this.errors={}
       
      if(this.Options.topText == "" || this.Options.bottomText == ""){
        error = true
        msg = "The fields can't be blank"
        this.errors['min']=this.Options.topText == ""
        this.errors['max']=this.Options.bottomText == ""
      }
      

      return {"error":error,"msg":msg};
    }
  }
};
</script>

<style>

</style>