<template>
  <div class="py-4 text-center lg:px-4">
  <div :class="{ 'alert-success-evt': success, 'alert-error-evt': error }"
   role="alert">
    <span class="text-white rounded-full alert-badge"
    :class="{ 'bg-red-800': error, 'bg-cyan-evt-200': success }">
      {{status}}
    </span>
    <span class="flex-auto mr-2 font-semibold text-left text-white">
      {{message}}
    </span>
  </div>
</div>
</template>

<script>

export default{
  props:{
    success: Boolean,
    error: Boolean,
    message: String,    
  }
}
</script>
