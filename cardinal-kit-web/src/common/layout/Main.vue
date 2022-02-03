<template>
  <div class="flex sidebar">
      <Sidebar
        :menu="menu"
        :className="'h-auto bg-danger'"
        :logo="logo"
        logout
        @handle-logout="handleLogout"
      />
    <div class="w-100">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
/* import Header from "@/components/auth/Header"; */
import Sidebar from "@/components/auth/sidebar/index.vue";
export default {
  components: {
  /*   Header, */
    Sidebar
  },
  data: function() {
    return {
      logo: require("@/assets/logo.png"),
    };
  },
  computed: {
    ...mapGetters("user", ["getUserRol"]),
    menu() {
      let main = [
        { name: "Studies", route: "/" },
      ];
      if (this.getUserRol == "superAdmin") {
        main.push({ name: "Register doctors", route: "/register" });
      }
      if (this.getUserRol == "superAdmin" || this.getUserRol == "doctor")
       {
        if (this.$route.params.studyId){
          main[0].children = [
            {
              name: "Patients",
              route: `/patients/${this.$route.params.studyId}`,
            },
            {
              name: "Surveys",
              route: `/surveysList/${this.$route.params.studyId}`
            }
          ];
        }
        if (this.$route.query.studyId){
            main[0].children = [
            {
              name: "Patients",
              route: `/patients/${this.$route.query.studyId}`,
            },
            {
              name: "Surveys",
              route: `/surveysList/${this.$route.query.studyId}`
            }
          ];
        }
      }
      else{
        console.log("else",)
         if (this.$route.params.studyId){
           main.push({ name: "Share User Info", route: `/share/${this.$route.params.studyId}` });
         }
         else if (this.$route.query.studyId){
           main.push({ name: "Share User Info", route: `/share/${this.$route.query.studyId}` });
         }
        
      }
      return main;
    }
  },
  methods: {
    ...mapActions("auth", ["Logout"]),
    handleLogout() {
      this.Logout().then(() => {
        console.log("Called Logout");
        this.$router.push("Login");
      });
    },
  },
};
</script>

<style>
.sidebar { 
  min-height: 100vh;
  height: 100%;
  position: inherit;
}
</style>
