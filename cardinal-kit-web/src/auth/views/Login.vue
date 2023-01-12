<template>
    <section class="wrapper-login">
      <Card>
        <template v-slot:card-header>
          <Logo :path="logo" :className="'text-center'" :width="'180'"></Logo>
        </template>
        <template v-slot:card-body>
          <br>
          <h4 class="my-2 text-muted">Sign In</h4>
          <login-form></login-form>
        </template>
        <hr />
        <template v-slot:card-footer>
          <div className="auth__social-networks">
            <p class="mb-1 subtitle">Login with social networks</p>
            <social-button @click="handleGoogleLogin"
              icon="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              text="Sign in with google" className="btn btn-ck otl-danger" />
            <social-button @click="handleAppleLogin"
              icon="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/240px-Apple_logo_black.svg.png"
              text="Sign in with apple" className="btn btn-ck otl-danger" />
          </div>
        </template>
      </Card>
    </section>
  </template>
  <script>
  import Logo from "../atoms/Logo";
  import Card from "../atoms/Card";
  import SocialButton from '../atoms/SocialButton';
  import LoginForm from "../organisms/LoginForm.vue";
  import { LogInWithGoogle, LogInWithAppleId } from "../services/auth"
  
  export default {
    data() {
      return {
        email: "",
        password: "",
        logo: require('@/assets/LogoCardinalKit@2x.png'),
      };
    },
    components: {
      Logo,
      Card,
      SocialButton,
      LoginForm
    },
    methods: {
      async handleGoogleLogin() {
        try {
          await LogInWithGoogle();
          this.$router.push({ name: "Home" })
        } catch (error) {
          console.error(error)
        }
      },
      async handleAppleLogin() {
        try {
          await LogInWithAppleId();
          this.$router.push({ name: "Home" })
        } catch (error) {
          console.error(error)
        }
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