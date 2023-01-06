<template>
  <section class="page">
    <!-- <h1 class="mb-5 text-capitalize"> {{categoryId}}</h1> -->
    <div class="row">
       <!-- <activity-card name="Actividad" date="7 may">
        <template v-slot:card-body>
          <div class="card-info">
            <div class="card-info__group">
              <p class="subtitle">move</p>
              <p>{{calories}} kcal</p>
            </div>
            <div class="card-info__group">
              <p class="subtitle">exercise</p>
              <p>{{exerciseTime}} min</p>
            </div>
            <div class="card-info__group">
              <p class="subtitle">Stand Up</p>
              <p>{{standUpTime}} h</p>
            </div>
          </div>
           <multiple-radial-bars :series="[calories,exerciseTime,standUpTime]" :height="'250'" :labels="['Move','exercise','Stand Up']"/> 
        </template>
      </activity-card> -->
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
import activityCard from "@/components/patients/healthKit/activity/activityCard";
import multipleRadialBars from "@/components/apexCharts/multipleRadialBars";
import { ACTIVITIES_PER_USER } from "@/plugins/mock/activities";

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