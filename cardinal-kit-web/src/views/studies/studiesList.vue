<template>
  <div>
    <study-list
      :studies="getUserStudies"
      :handleSelecStudy="handleSelecStudy"
    />
    <extra-users/>
    <br />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import store from "@/store";

//Components
import studyList from "@/components/studies/studiesList";
import extraUsers from "@/components/share/extraUsers";

export default {
  name: "Home",
  components: {
    studyList,
    extraUsers,
  },
  computed: {
    ...mapGetters("user", ["getUserStudies","getUserRol","getUserId"]),
  },
  methods: {
    handleSelecStudy(studyId) {
      this.studySelected = studyId;

      if (this.getUserRol == "doctor" || this.getUserRol=="superAdmin") {
        this.$router.push(`/patients/${studyId}`)

      } else {
        this.$router.push({ name: "healthUser", query: {studyId, userId: this.getUserId}})
      }
    },
  },
  mounted() {
    if (this.getUserStudies.length == 1) {
      if (this.getUserRol == "user") {
        this.$router.push({ name: "healthUser", query: {studyId: this.getUserStudies[0], userId: this.getUserId}})
      } else {
        this.$router.push(`/patients/${this.getUserStudies[0]}`)
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    Promise.all([
      store.dispatch("user/FetchUserRolesAndStudies")],
      store.dispatch("share/FetchUsersIHaveAccessTo")
      ).then(() => {
      next();
    });
  },
};
</script>