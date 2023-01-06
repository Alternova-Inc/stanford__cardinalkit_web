<template>
  <header :class="className">
    <router-link to="/" class="header-brand">
      <Logo :path="srcLogo"  :width="widthLogo" />
      <h3 v-if="brandTitle">{{brandTitle}}</h3>
    </router-link>
    <div class="header-menu" :class="{ show: showMenu }">
      <span @click="handleShowMenu" class="close-menu ev-link pointer">
        ✖
      </span>
      <slot name="menu">
          <div v-for="(item, index) in menu" :key="index">
            <router-link class="ev-link" :to="item.route">
              {{item.name}}
            </router-link>
          </div>
         <span v-if="logout" class="ev-link pointer logout" @click="emitLogout()">Logout</span>
      </slot>
    </div>
    <i @click="handleShowMenu" class="active-menu pointer">
      <img src="@/assets/icons/menu.svg" alt="menu">
    </i>
  </header>
</template>

<script>
import Logo from "@/components/auth/Logo";
import { ref } from 'vue';

export default {
  props: {
    srcLogo: {
      type: String
    },
    widthLogo: {
      type: String,
      default: '50'
    },
    logout: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: 'bg-default'
    },
    menu: Array,
    brandTitle: String,
  },
  components: {
    Logo,
  },
  setup(props, context) {
    const showMenu = ref(false);

    function handleShowMenu() {
      showMenu.value = !showMenu.value
    }

    function emitLogout() {
      context.emit('handleLogout', true);
    }

    return {
      showMenu,
      handleShowMenu,
      emitLogout
    }
  }
}
</script>

<style lang="scss" scoped>

.bg-default {
  background-color: whitesmoke;
  .header-menu {
    background-color: whitesmoke;
  }
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  padding: .5rem 2rem;
  z-index: 2;
  box-shadow: $shadow-sm;

  .header-menu {
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all .5s ease;

    .logout {
      padding: .5rem;
      border: solid 2px;
      border-radius: 4px;
    }

    .close-menu {
      display: none;
    }
    
    @media (max-width: 768px) {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      flex-flow: column;
      background: inherit;
      align-items: center;
      font-size: 1.3em;
      padding: 2.5rem 1rem;
      transform: translateX(100%);

      &.show {
        transform: translateX(0);
      }

      .close-menu {
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        padding: 1rem;
      }
    }
  }

  .active-menu {
    display: none;
    @media (max-width: 768px) {
      display: block;
    }
  }
}
</style>
