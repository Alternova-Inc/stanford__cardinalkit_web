<template>
  <div class="page">
    <div class="categories-grid">
      <category
        v-for="category in categories"
        :data="category"
        :key="category.id"
        :userId="userId"
        :studyId="studyId"
        :icon="category.icon"
        v-show="getValidCategories.includes(category.id)"
      />
    </div>
    <div class="wrapper-graphs content" v-if="showActivityIndex">
    <alt-date
          withCalendar
          :defaultDate="date"
          range
          @update:model-value="handleChangeDate"
        />
      <h1>Activity Index</h1>
      <div >
        <span >7-day moving avg (steps/day)</span>
        <line-chart
          ref="chart"
          id="line-chart"
          :key="1"
          :series="filteredData"
        />
       
      </div>
    </div>
  </div>
</template>
<script>
import category from "./categoryCard";
import { CategoriesList } from '@/common/static_data'
import { mapGetters } from 'vuex';
import LineChart from "@/components/apexCharts/LineChart";
import AltDate from "@/components/calendar/AltDate";

export default {
  name: "categories",
  components: {
    category,
    CategoriesList,
    LineChart,
    AltDate
  },
  data(){
    return{
      date: { startDate: new Date(new Date().setDate(-30)) },
      categories:[],
      userId: this.$route.query.userId,
      studyId: this.$route.query.studyId,
      filteredIndexData: [ {name:"ActivityIndex",data:[]} ]
    }
  },
  methods: {
    async handleChangeDate(value) {
      if(value){        
        if(this.getActivityIndexDataToGraphic[0]){
            let data = [...this.getActivityIndexDataToGraphic][0].data

           let startTimeStamp = value.startDate.getTime()
           let endTimeStamp = value.endDate.getTime()

           let finalData = data.filter(function(element){
             return (element.x > startTimeStamp && element.x < endTimeStamp)
           })
           await new Promise(resolve => setTimeout(resolve, 10));;
           this.filteredIndexData=[ {name:"ActivityIndex",data:finalData} ]

        }
        
      }
      this.$refs.chart.zoomX(value.startDate, value.endDate);
      
    }
  },
  computed: {
    ...mapGetters("patient",["getValidCategories", "getActivityIndexDataToGraphic"]),
    showActivityIndex(){
      let show = false
      if(this.getActivityIndexDataToGraphic.length>0){
        if(this.getActivityIndexDataToGraphic[0].data.length>0){
          show=true
        }
      }
      return show
    },
    filteredData(){
      return [ {name:"ActivityIndex",data:this.filteredIndexData[0].data} ]
    }
  },
  created(){
    this.categories = CategoriesList
    this.filteredIndexData = [...this.getActivityIndexDataToGraphic]
  }
};
</script>

<style lang="scss" scoped>
  .width {
    min-width: 340px;
    max-width: 500px;
  }
  .box {
    flex-wrap: wrap;
  }
  .categories-grid {
    display: grid;
    gap: 20px 40px;
    grid-template-columns: repeat(2, minmax(300px, 1fr));
    justify-content: center;
    align-items: center;
  }
  .wrapper-graphs {
    display: grid;
    gap: 15px;
    max-width: 1200px;
    margin: auto;
  }
  @media (max-width: 360px) {
    .content{
      padding: 1rem;
    }
  }
  @media (min-width: 361px) {
    .content{
      padding: 1rem 4rem;
    }
  }
  @media (max-width: 672px) {
    .categories-grid {
      display: grid;
      gap: 20px 40px;
    }
  }
</style>