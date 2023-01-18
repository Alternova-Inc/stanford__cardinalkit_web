<template>
  <section class="page">
    <div class="row">
        <div class="col flex wrap" v-if="activities && activities.length" >
          <activity-card 
            v-for="activity in activities" :key="activity.HkCode"
            :name="activity.HkCodeName" 
            :date="activity.Date.formatted"
            :color-title="activity.Color" 
            :value="''+activity.Value" 
            :measure="activity.Unit"
            :logo="activity.Logo"
            :id="activity.HkCode">
          </activity-card>
        </div>
    </div>
  </section>
</template>
<script>
import store from "@/store";
import activityCard from "@/patients/atoms/activityCard";
import multipleRadialBars from "@/components/apexCharts/multipleRadialBars";

import { mapGetters } from 'vuex';
export default {
  name: "activity",
  components: {
    activityCard,
    multipleRadialBars
  },
  data() {
    return {
      calories:39,
      exerciseTime:10,
      standUpTime:2,
      activities: [],
      categoryId: this.$route.params.categoryId
    };
  },
  methods: {},
  computed: {
    ...mapGetters('patient',['getCategoryDataWebFormat'])
  },
  mounted(){
    this.activities = this.getCategoryDataWebFormat(this.categoryId)
  },
  beforeRouteEnter(to, from, next) {
    if(to.params.categoryId=="survey"){
    }
    else
    {
      Promise.all([
        store.dispatch("patient/FetchLastCategoryData",
        { studyId:`${to.query.studyId}`, userId:`${to.query.userId}`,category:`${to.params.categoryId}`})
      ]).then(()=>{
        next()
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  flex-flow: wrap;
}

.card-info {
  padding: 1rem;
  display: flex;
  justify-content: space-between;

  &__group {
    text-align: center;
    padding: 1rem;
    width: 100%;
    
    .subtitle {
      font-weight: bold;
      margin-bottom: .8rem;
      text-transform: capitalize;
    }

    &:nth-child(n) {
      border-right: solid lightgray 1px;
    }
    &:last-child {
      border: none;
    }
  }
}
</style>