<template>
      <section class="statistic">
        
        <div class="wrapper-graphs">
          <h1 class="mb-5 text-muted">Monthly Active Users</h1>
          <line-chart
            ref="chart"
            :key="1"
            :series="dataFormatted"
          />
        </div>
      </section>
</template>

<script>
import LineChart from "@/components/apexCharts/LineChart";
import { mapGetters } from 'vuex';

export default {
    name: "UsageGraph",
    components: {
      LineChart
    },
    computed: {
      ...mapGetters("studies",["getMonthUsage"]),
      dataFormatted(){
        let data = []
        let sorted = this.sort_object(this.getMonthUsage)
        for (const key in sorted) {
          data.push({'x':key,'y':sorted[key]})
        } 
        return [
          {
            'name':'Data',
            'data':data
          }
        ]
      }
    },
    methods:{
      sort_object(obj) {
        let items = Object.keys(obj).map(function(key) {
            return [key];
        });
        items.sort()
        let sorted_obj={}
        items.forEach(element => {
          sorted_obj[element] = obj[element]
        });
        return(sorted_obj)
      }
    }
}
</script>

<style lang="scss" scoped>
.statistic {
  display: flex;
  padding: 1rem 3rem;
  justify-content: space-between;
}
.wrapper-graphs {
  display: grid;
  gap: 15px;
  max-width: 1200px;
  margin: auto;
}
</style>
