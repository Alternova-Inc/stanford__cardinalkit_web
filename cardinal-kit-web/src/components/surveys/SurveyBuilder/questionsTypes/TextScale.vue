<template >
  <div>
      <label>Default Index: </label>
      <input
        v-model="Survey.defaultIndex"
        :name="`defaultIndex`"
        type="numeric"
        :class="classError('default')"
        placeholder="1"
        min="0"
      />


    <label>Options: </label>
    <div v-for="(option, index) in Survey.options" :key="index">
      <br />
      <div style="display: flex;">
        <input class="RadioInput" type="radio" disabled />
        <input
          v-model="option.text"
          :name="`options[${index}]`"
          type="text"
          :class="classError(option.value)"
        />
        <button
          v-if="index > 1"
          @click="
            () => {
              deleteOptions(index);
            }
          "
          type="button"
        >
          Delete
        </button>
      </div>
      <br />
    </div>
    <br />
    <br />
    <div class="form-group">
      <button @click="addOptions(Options)" type="button" class="btn btn-terceary">
        Add Options
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data:() => ({
    errors:{}
  }),
  props: {
    Survey: Object,
  },
  methods: {
    classError(value){
      if(this.errors[value]){
        return "TextInput input-no-value-style"
      }
      return "TextInput"
    },
    addOptions() {
      const val = this.Survey.options.length;
      this.Survey.options.push({ text: "", value: ""+val });
    },

    deleteOptions(index) {
      this.Survey.options.splice(index, 1);
    },
    checkQuestion(){
      let error = false
      this.errors={}
      let msg = ""
      if(this.Survey.defaultIndex == ""){
        error = true
        msg = "The fields can't be blank"
        this.errors['default']=true
      }
       this.Survey.options.forEach(element => {
        if(element.text == ""){
          error = true
          msg = "The fields can't be blank"
          this.errors[element.value]=true
        }
      });
      return {"error":error,"msg":msg};
    }
  },
  mounted(){
      this.Survey.options=[
            { text: "", value: "0" },
            { text: "", value: "1" },
          ];
  }
};
</script>

<style>
</style>