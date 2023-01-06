<template>
  <section class="wrapper-login">
    <Card>
      <template v-slot:card-header>
        <Logo :path="logo" :className="'text-center'" :width="'180'"></Logo>
      </template>
      <template v-slot:card-body>
        <br>
        <h4 class="my-2 text-muted">Sign In</h4>
        <form class="login-form" @submit.prevent="handleSubmitLogin">
          <div v-if="getError.error" className="auth__error">
            <p class="mb-1 subtitle">{{getError.errorMessage}}</p>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              placeholder=""
              id="email"
              v-model="email"
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              placeholder=""
              id="password"
              v-model="password"
              autocomplete="on"
            />
            <router-link to="#" class="ev-link forgot "
              >Forgot Password?</router-link
            >
          </div>
          <button 
            class="btn btn-ck fill-danger w-50 m-auto"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </template>
      <hr />
      <template v-slot:card-footer>
        <div className="auth__social-networks">
          <p class="mb-1 subtitle">Login with social networks</p>
          <social-button 
            @click="handleGoogleLogin"
            icon="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
            text="Sign in with google"
            className="btn btn-ck otl-danger"
          />
          <social-button
            @click="handleAppleLogin" 
            icon="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/240px-Apple_logo_black.svg.png" 
            text="Sign in with apple"
            className="btn btn-ck otl-danger"
          />
        </div>
        <!-- <div class="text-center">
          <span class="ft-10">Not a member? </span>
          <router-link class="ev-link" to="/signup">Sign up</router-link>
        </div> -->
      </template>
    </Card>
  </section>
</template>
<script>
import Logo from "@/components/auth/Logo";
import Card from "@/components/auth/Card";
import store from "@/store"
import { mapActions, mapGetters } from "vuex";
import SocialButton from '../../components/auth/SocialButton.vue';

export default {
  data() {
    return {
      email: "",
      password: "",
      logo: require('@/assets/LogoCardinalKit@2x.png'),
      showError: false
    };
  },
  components: {
    Logo,
    Card,
    SocialButton,
  },
  computed:{
    ...mapGetters("auth",["getError"])
  },
  methods: {
    ...mapActions("auth", ["SignIn","LogInWithGoogle", "LogInWithAppleId"]),
    handleSubmitLogin() {
      this.SignIn({ email: this.email, password: this.password })
      .then((response)=>{
        if(response.isLogged){
          this.$router.push({name:"Home"});
        }
      })
    },
    handleGoogleLogin(){
      this.showError = false
      this.LogInWithGoogle()
      .then((response)=>{
        if(response.isLogged){
          this.$router.push({name:"Home"});
        }
      })
    },
    handleAppleLogin() {
      this.LogInWithAppleId()
      .then((response)=>{
        if(response.isLogged){
          this.$router.push({ name: "Home" });
        }
      })
      .catch((error) => console.log('Error from Server', error))
    }
  },
};
</script>
<style lang="scss" scoped>
.wrapper-login {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  height: 100vh;
  background: $background-login;

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
      }:focus {
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
  
  .auth__social-networks {
    margin-bottom: .5rem;
    display: grid;
    gap: 10px;

    .subtitle {
      margin-top: 0;
      text-align: center;
    }
  }
  .auth__error {
    margin-bottom: .5rem;
    display: grid;
    gap: 10px;
    margin-top: 0;
    text-align: center;
    color: red;
  }
}

</style>
