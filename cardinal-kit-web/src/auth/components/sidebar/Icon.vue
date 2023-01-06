<template>
  <img alt="icon" v-if="icon?.type === 'url'" class="mr-2" :src="icon?.content" />
  <i class="mr-2 icon" v-else v-html="icon?.content"></i>
</template>

<script>
export default {
  props: {
    icon: {
      type: Object
    }
  }
}
</script>

<style lang="scss">
/* img {
  width: 20px;
} */
i.icon {
  width: 20px;

  svg {
    width: 20px;
    height: 100%;
  }
}
</style>
