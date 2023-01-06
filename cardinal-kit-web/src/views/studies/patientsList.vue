<template>
  <div>
      <patient-list :patients="getUsersStudy(studyId)" :studyId="studyId" />
      <br />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import store from "@/store";
import patientList from "@/components/studies/patientsList";

export default {
  name: "Home",
  components: {
    patientList,
  },
  computed: {
    ...mapGetters("studies", ["getUsersStudy"]),
  },
  props: {
    studyId: {
      type: String,
      required: true,
    },
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch("studies/FetchUsers", { studyId: to.params.studyId })
    .then(() => {
      next();
    });
  },
};
</script>
<style lang="scss">
  .surveysBtn {
    margin: 65px;
    text-decoration: none;
    font-weight: 300;
    font-size: 20px;
    color: #000000;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: transparent;
    border-width: 2px;
    border-style: solid;
    border-color: #000000;
    box-shadow: 5px 5px 5px
  }
</style>
