<template>
  <div>
    <Multiselect  
      :searchable="true"
      :disabled="disabledSelect"
      trackBy="id"
      label="name"
      v-model="internalValue" 
      :options="options" 
      :placeholder="_placeholder" 
      :canClear="false"
      :canDeselect="false"
    />
  </div>
</template>
<script>
import Multiselect from "@vueform/multiselect";
export default {
  components: { Multiselect },
  data() {
    return {
      internalValue: null,      
    };
  },
  methods:{
    setNewValue(newValue){
      this.internalValue = newValue
    }
  },
  watch: {
    internalValue: function(value){
      this.$emit('update:modelValue', value)
      if(this.onChange) this.onChange()
    }
  },
  computed: {
    _placeholder() {
      return this.placeholder??"Select One"
    }
  },
  props: {
    options: {
      type:Array,
      require:true
    },
    placeholder: {
      type:String,
      require:false
    },
    onChange: {
      type:Function,
      require:false
    },
    defaultValue:{
      type: String,
      require: false
    },
    disabledSelect: {
      type: Boolean,
      require: false,
      default: () => false
    }
  },
  created(){
    if (this.defaultValue){
      this.internalValue = this.defaultValue
    }
  }
};
</script>

<style>
  .is-disabled .multiselect-input {
    background: transparent !important;
  }
</style>
<style src="@vueform/multiselect/themes/default.css"></style>