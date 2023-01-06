<template>
  <form class="login-form" @submit.prevent="handleSubmitLogin">
    <div v-if="getError.error" className="auth__error">
      <p class="mb-1 subtitle">{{ getError.errorMessage }}</p>
    </div>
    <div class="form-group">
      <label for="email">Email Address</label>
      <input type="email" placeholder="" id="email" v-model="email" />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" placeholder="" id="password" v-model="password" autocomplete="on" />
      <router-link to="#" class="ev-link forgot ">Forgot Password?</router-link>
    </div>
    <button class="btn btn-ck fill-danger w-50 m-auto" type="submit">
      Sign in
    </button>
  </form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";


export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapGetters("auth", ["getError"])
  },
  methods: {
    ...mapActions("auth", ["SignIn"]),
    handleSubmitLogin() {
      this.SignIn({ email: this.email, password: this.password })
        .then((response) => {
          if (response.isLogged) {
            this.$router.push({ name: "Home" });
          }
        })
    },
  }
};
</script>
  
<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 2rem;

  .form-group {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;

    label {
      text-transform: uppercase;
      text-align: start;
      margin-bottom: 3px;
      font-size: 10pt;
      color: #6c757d
    }

    input {
      margin-bottom: 0.5rem;
      font-size: 1em;
      border: 0;
      border-bottom: 1px solid #6c757d;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 0;
      cursor: text;
    }

    :focus {
      outline: 0;
      border-bottom: 1px solid #B61440;
    }

    a {
      width: 100%;
      display: flex;
      justify-content: flex-end;

      &.forgot {
        font-size: 10pt;
        color: #6c757d
      }
    }
  }
}
</style>