<template>
  <section class="wrapper-login">
    <Card>
      <template v-slot:card-header>
        <div class="card-header">
          <Logo :path="logo" :width="'100'" :className="'flex justify-center'"></Logo>
          <h1 id="signup" class="mb-1 text-center">Register doctor</h1>
          <!-- <span class="block text-center">
            Already have an account?
            <router-link class="ev-link" to="/login">Sign in</router-link>
          </span> -->
        </div>
      </template>
      <template v-slot:card-body>
        <form class="login-form" @submit.prevent="handleSubmitRegister">
          <div class="form-group__horizontal">
            <div class="w-100 form-group">
              <label for="firstName">First Name</label>
              <input
                class="form-input"
                type="text"
                placeholder=""
                id="firstName"
                v-model="firstName"
              />
            </div>
            <div class="w-100 form-group">
              <label for="lastName">Last Name</label>
              <input
                class="form-input"
                type="text"
                placeholder=""
                id="lastName"
                v-model="lastName"
              />
            </div>
          </div>
          <div class="w-100 form-group">
            <label for="email">Email Address</label>
            <input
              class="form-input"
              type="email"
              placeholder=""
              id="email"
              v-model="email"
              required
            />
          </div>
          <!-- <div class="form-group">
            <label for="password">Password</label>
            <input
              class="form-input"
              type="password"
              placeholder=""
              id="password"
              v-model="password"
              required
              autocomplete="on"
            />
          </div> -->
          <button id="b-signup" class="btn btn-primary" type="submit">
            Register
          </button>
        </form>
      </template>
    </Card>
  </section>
</template>
<script>
import Logo from '@/components/auth/Logo';
import Card from '@/components/auth/Card';
import { mapActions } from 'vuex'

export default({
  data(){
    return{
      email:'',
      password: '',
      firstName: '',
      lastName: '',
      logo: require('@/assets/logo.png')
    }
  },
  components:{
    Logo,
    Card
  },
  methods:{
    ...mapActions('auth',['SignUp']),
    handleSubmitRegister(){
      this.SignUp({
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
      })
    }
  }
})

</script>
<style lang="scss" scoped>
.wrapper-login {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  height: 100vh;
  background: $background-signup;

  .card-header {
    margin-bottom: 2rem;

    h1#signup {
      font-size: 2rem;
    }

    span {
      font-size: 10pt;
    }
     @media screen and (max-width: 510px) {
       margin-bottom: 1rem;
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 1rem;

    .form-group {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;

      &__horizontal {
        display: flex;
        gap: 15px;

        @media screen and (max-width: 510px) {
          flex-direction: column;
        }
      }

      label {
        text-align: start;
        margin-bottom: 3px;
        font-size: 10pt;
      }

      a {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
    button#b-signup {
      margin-top: 1rem;
    }
  }
}
</style>
