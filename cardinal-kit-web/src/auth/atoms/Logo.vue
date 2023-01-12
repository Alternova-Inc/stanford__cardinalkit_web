<template>
  <div>
    <picture :class="className" class="flex">
      <img :src="path || ''" alt="logo" :width="width" />
      <div v-if="title" class="mt-3">
        <h2>{{title}}</h2>
      </div>
    </picture>
  </div>
</template>
<script>
export default {
  name: 'Logo',
  props: {
    width: String,
    className: String,
    path: String,
    title: String
  },
}
</script>
