<template>
  <div :style="styles" class="small-card" @click="$emit('onClick')">
		<div v-if="image" class="small-card-img flex">
			<img class="logo" :src="image" alt="logo" >
      <div class="small-card-info">
        <p class="small-card-info__title">{{ title }}</p>
        <p v-if="description" class="small-card-info__description">{{ description }}</p>
        <small class="small-card-info__link pointer">{{ actionText || Action }}</small>
      </div>
		</div  >
	</div>
</template>

<script>
import { reactive } from 'vue';

export default {
	props: {
		image: String,
		title: String,
		description: String,
		actionText: String,
		bgCard: String,
		bgCardHover: String,
		colorText: String,
		colorTextAction: String,
		colorTextHover: String
	},
	setup(props) {
		const styles = reactive({
			'--bg-card': props.bgCard || '#dadcff',
			'--bg-card-hover': props.bgCardHover || '#b71540',
			'--text-color': props.colorText || '#2c3e50',
			'--text-color-action': props.colorTextAction  || '#ababab',
			'--text-color-hover': props.colorTextHover  || 'white',
		})

		return {
			styles
		}
	},
}
</script>

<style lang="scss" scoped>
.small-card {
  display: inline-block;
  position: relative;
  border-radius: 10px;

  &-img {
    position: relative;
    background-color: #f5f5f7;
    padding: 2rem 1.5rem;
    border-radius: 10px;
    border: 2.25px solid gainsboro;
    transition: background-color .5s;
    justify-content: space-between;

    .logo {
      width: 100px;
    }
  }

  &-info {
    position: relative;
    text-align: right;
    padding: 1rem;
    z-index: 1;

    &__title {
      font-weight: 700;
      transition: color .7s;
      text-transform: uppercase;
    }

    &__link {
      font-size: 9pt;
      color: var(--text-color-action);
      transition: color .7s;
    }
  }
  
  &:hover {
    .small-card-img {
      background-color: var(--bg-card-hover);
    }

    .small-card-info {
      &__title {
        color: var(--text-color-hover);
      }

      &__link {
        color: var(--text-color-hover);
      }
    }
  }
}
</style>