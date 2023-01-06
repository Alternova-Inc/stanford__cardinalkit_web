<template>
  <div>
    <bread-crumb 
      :data="breadCrumb"
      :userId="$route.query.userId"
      :studyId="$route.query.studyId">
    </bread-crumb>

    <router-view></router-view>

  </div>
</template>

<script>
import breadCrumb from "@/components/breadcrumb.vue"
import { mapGetters } from 'vuex';
import store from "@/store";
export default {
  name: "StudyDetail",
  components:{
    breadCrumb,
  },
  data(){
    return{
      path: [
        {label: "Health Categories", name: "categories"},
        {label: "Activity", name:"category", param: "categoryId"},
        {label: "Statistics", name: "statistic"},
      ]
    }
  },
  methods: {},
  computed:{
    ...mapGetters('patient',['getHealthData']),
    getActivityIndexData(){
      return ","
    },
    breadCrumb(){
      let index = this.path.findIndex((obj) => obj.active)
      return  this.path.slice(0, index+1);
    }
  },
  created(){
    let path = localStorage.getItem("path");
    if (path){
      this.path = JSON.parse(path);
    }
   
  },
  beforeRouteEnter(to, from, next) {
    Promise.all([
      store.dispatch("patient/FecthCategoryWithData", {
        studyId: `${to.query.studyId}`,
        userId: `${to.query.userId}`
      }),
      store.dispatch("patient/FetchMetricsData",{
        studyId: `${to.query.studyId}`,
        userId: `${to.query.userId}`
      })
    ]).then(() => {
       let path = JSON.parse(localStorage.getItem("path"));
       if(path == null){
         path = [
          {label: "Health Categories", name: "categories"},
          {label: "Activity", name:"category", param: "categoryId"},
          {label: "Statistics", name: "statistic"},
        ]
       }
       if(path!=null){
          path.forEach(obj => {
          obj.active = obj.name === to.name;
          if (obj.param && to.params && obj.active){  
            obj.params = to.params
            obj.label = to.params[obj.param]
          }
          return obj
        });
        localStorage.setItem("path", JSON.stringify(path))
      }
      next();
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.path.forEach(obj => {
      obj.active = obj.name === to.name;
      if (obj.param && to.params && obj.active){  
        obj.params = to.params
        obj.label = to.params[obj.param]
      }
      return obj
    });
    localStorage.setItem("path", JSON.stringify(this.path))
    this.path = [...this.path]
    next();
  }
};
</script>

