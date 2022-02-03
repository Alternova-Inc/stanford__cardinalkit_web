<template>
  <div > 
  <Multiselect :searchable="true" v-model="internalValue" :options="options" mode="tags" class="multiselect"
  > 
    <template v-slot:tag="{ option, handleTagRemove, disabled }">
      <div class="multiselect-tag is-user">
        {{option.label}}
        <i
          v-if="!disabled"
          @click.prevent
          @mousedown.prevent.stop="handleTagRemove(option, $event)"
        />
      </div>
    </template>
  </Multiselect>
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";
export default {
  components: { Multiselect },
  data() {
    return {
      internalValue:null,      
    };
  },
  watch:{
    internalValue: function(value){
      this.$emit('update:modelValue', value)
    }
  },
  
  props: {
    options:{
      type:Array,
      require:true
    },
  },
};
</script>

<style lang="scss" scoped>
  .multiselect-tag.is-user {
    padding: 5px 8px;
    border-radius: 22px;
    background: #B61440;
    margin: 3px 3px 8px;
  }

  .multiselect-tag.is-user i:before {
    color: #ffffff;
    border-radius: 50%;;
  }
</style>
