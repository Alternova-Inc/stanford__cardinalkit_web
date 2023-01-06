<template>
  <section class="wrapper-login">
    <Card>
      <template v-slot:card-header>
        <div class="card-header">
          <h1 id="signup" class="mb-1 text-center text-muted">Register Doctors</h1>
        </div>
      </template>
      <template v-slot:card-body>
        <form class="login-form" @submit.prevent="handleSubmitRegister">
          <div class="form-group__horizontal"></div>
          <div class="w-100 form-group">
            <label for="email" class="text-muted">EMAIL</label>
            <input
              class="form-input"
              type="email"
              placeholder=""
              id="email"
              v-model="email"
              required
            />
          </div>
          <div class="w-100 form-group">
            <label for="studies" class="text-muted">STUDY</label>
            <Multiselect :options="getUserStudies" v-model="studies" />
          </div>
          <button id="b-signup"
            class="btn btn-ck fill-danger w-50 m-auto"
            type="submit">
            Register
          </button>
        </form>
      </template>
    </Card>
  </section>
</template>
<script>

import Card from "@/components/auth/Card";
import Multiselect from "@/components/multiSelect/Multiselect";
import { mapActions, mapGetters } from "vuex";
import store from "@/store";

export default {
  data() {
    return {
      email: "",
      studies: []
    };
  },
  components: {
    Card,
    Multiselect,
  },
  methods: {
    ...mapActions("auth", ["SingUpNoPassword"]),
    handleSubmitRegister() {
      this.SingUpNoPassword({
        email: email.value,
        studies: this.studies,
      }).then(() => {
        this.studies=[]
        this.email=""
        this.$notify({
          title: "Success",
          text: "The user was successfully registered",
        });
      }).catch((error)=>{
        this.$notify({
          title: "Error",
          text: error,
        });
      });
    },
  },
  computed: {
    ...mapGetters("user", ["getUserStudies"]),
  },
  beforeRouteEnter(to, from, next) {
    Promise.all([store.dispatch("user/FetchUserRolesAndStudies")]).then(() => {
      next();
    });
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
