<template>
  <section class="statistic">
  
    <!--   <h1 class="mb-5">Statistics</h1> -->
    <div class="graphic">
      <div class="mb-5">
        <h3 class="my-3">{{ transformAppleCode(hkCode) }}</h3>
        <alt-date
          withCalendar
          :defaultDate="date"
          range
          @update:model-value="handleChangeDate"
        />
        <div class="wrapper-graphs" v-if="dataFiltered">
          <line-chart
            v-if="GetGraphType == 'line'"
            ref="chart"
            :key="1"
            :series="getSpecificHealthDataGrapFormat(hkCode)"
          />
          <scatter-chart
            v-if="GetGraphType == 'scatter'"
            ref="chart"
            :key="2"
            :series="getSpecificHealthDataGrapFormat(hkCode)"
            :labels="GetCategoriesByHkType(hkCode)"
          />
          <range-chart
            v-if="GetGraphType == 'sleep'"
            ref="chart"
            :key="3"
            :series="getSpecificHealthDataGrapFormat(hkCode)"
            :yAxisFormat="
              function(value) {
                return new Date(value).toISOString().substr(11, 8);
              }"
            :yMax="24 * 3600 - 1"
            :yMin="0"
          />
          <range-chart
            v-if="GetGraphType == 'heart'"
            ref="chart"
            :key="4"
            :series="getSpecificHealthDataGrapFormat(hkCode)"
            :yMax="100"
            :yMin="0"
            :titleFormatter="
              (seriesName, { w, seriesIndex, dataPointIndex }) => {
                x = w.globals.initialSeries[seriesIndex].data[dataPointIndex].x;
                hourStart = x.getHours();
                hourEnd = hourStart + 1;
                return seriesName + ': ' + hourStart + ' - ' + hourEnd;
              }"
          />
          <range-chart
            v-if="GetGraphType == 'mindful'"
            ref="chart"
            :key="5"
            :series="getSpecificHealthDataGrapFormat(hkCode)"
            :horizontal="true"
            :toolTipYFormat="
              function(value) {
                return new Date(value).toISOString().substr(11, 8);
              }"
          />
        </div>
        <div class="mb-1" v-if="getHealthDataGraphResume(hkCode)" >
          <p><b>{{ getHealthDataGraphResume(hkCode).value }}</b></p>
          <p><b>{{ getHealthDataGraphResume(hkCode).date }}</b></p>
          <p>{{ getHealthDataGraphResume(hkCode).title }}</p>
        </div>
      </div>
    </div>
    <div class="height">
      <alt-table
        :columns="[{ header: 'Date' }, { header: 'Value' }]"
        pagination
        :paginationOptions="paginationOptions"
        @onPagination="handlePagination"
      >
        <template #t-row>
          <tr v-for="(data, index) in getPageItems" :key="index">
            <td>
              {{ transformDate(data.Date.Date) }}
            </td>
            <td>{{ data.Value }} {{ data.Unit }}</td>
          </tr>
        </template>
      </alt-table>
    </div>
  </section>
</template>

<script>
import store from "@/store";
import multipleRadialBars from "@/components/apexCharts/multipleRadialBars";
import BarChart from "@/components/apexCharts/BarChart";
import LineChart from "@/components/apexCharts/LineChart";
import ScatterChart from "@/components/apexCharts/ScatterChart";
import RangeChart from "@/components/apexCharts/RangeChart";
import MultipleRadialBars from "../../../components/apexCharts/multipleRadialBars.vue";
import { mapActions, mapGetters } from "vuex";
import {
  transformAppleCode,
  GetCategoriesByHkType,
} from "@/common/helpers/healthKit";
import AltDate from "@/components/calendar/AltDate.vue";
import altTable from "@/components/tables/altTable";

export default {
  components: {
    multipleRadialBars,
    BarChart,
    LineChart,
    MultipleRadialBars,
    ScatterChart,
    AltDate,
    RangeChart,
    altTable,
  },
   data() {
    return {
      date: { startDate: new Date(new Date().setDate(-30)) },
      currentPage: 1,
      limit: 10,
      studyId: this.$route.query.studyId,
      userId: this.$route.query.userId,
      hkCode: this.$route.params.hkCode,
      firstDateChange: true,
      dataFiltered: false
    };
  },
  computed: {
    ...mapGetters("patient", [
      "getSpecificHealthDataGrapFormat",
      "getSpecificHealthData",
      "getHealthDataGraphResume",
    ]),
    GetGraphType() {
      if (this.hkCode == "HKCategoryTypeIdentifierSleepAnalysis") {
        return "sleep";
      } else if (this.hkCode == "HKQuantityTypeIdentifierHeartRate") {
        return "heart";
      } else if (this.hkCode == "HKCategoryTypeIdentifierMindfulSession") {
        return "mindful";
      }
      else if (this.hkCode == "HKCategoryTypeIdentifierSexualActivity"){
        return "line"
      }
       else if (this.hkCode.includes("Category")) {
        return "scatter";
      } else {
        return "line";
      }
    },
    getPageItems() {
      let items = this.getSpecificHealthData(this.hkCode);
      let lowerLimit = (this.currentPage - 1) * this.limit;
      let upperLimit = this.currentPage * this.limit;
      if(items){
        return items.slice(lowerLimit, upperLimit);
      }
      else{
        return []
      }
      
    },
    paginationOptions() {
      return {
        limit: [10, 20],
        total: this.getSpecificHealthData(this.hkCode)?this.getSpecificHealthData(this.hkCode).length:0,
        currentPage: this.currentPage,
      };
    }
  },
 
  methods: {
    ...mapActions("patient", ["FetchSpecificTypeData"]),
    transformAppleCode,
    GetCategoriesByHkType,
    handleChangeDate(value) {
      if(this.firstDateChange){
        let allData = this.getSpecificHealthDataGrapFormat(this.hkCode)
        if (allData.length>0){
          let data = allData[0].data
          if (data.length>0){
            let lastValue = data[data.length-1]
            if (value.startDate>lastValue.x){
              value.startDate=lastValue.x
            }
          }
        }
      }
      this.firstDateChange = false

      if (value) {
        // if (this.$refs.chart) {
          if (value.endDate) {
            this.FetchSpecificTypeData({
              studyId: this.studyId,
              userId: this.userId,
              dataType: this.hkCode,
              dates: { startDate: value.startDate, endDate: value.endDate },
            }).then(()=>{
                this.dataFiltered = true
            });
            if (this.$refs.chart) {
              this.$refs.chart.zoomX(value.startDate, value.endDate);
            }
          }
      }
    },
    transformDate(date) {
      return date.toLocaleString("en-US", { timeZone: "UTC" });
    },
    handlePagination(pagination) {
      this.currentPage=pagination.currentPage
      this.limit=pagination.limit
      let total = this.getSpecificHealthData(this.hkCode).length
      if(this.currentPage > Math.ceil(total/this.limit)){
        this.currentPage = Math.ceil(total/this.limit)
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next()
  }
};
</script>

<style lang="scss" scoped>
.wrapper-graphs {
  display: grid;
  gap: 15px;
  max-width: 1200px;
  margin: auto;
}
.statistic {
  display: flex;
  padding: 1rem 3rem;
  justify-content: space-between;
}
.graphic {
  width: 45rem;
}
.height {
  height: 30rem;
  overflow: auto;
  border-radius: .5rem;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
}
@media (max-width: 1390px) {
  .statistic {
    display: flex;
    flex-direction: column;
  }
  .wrapper-graphs {
    width: auto;
  }
  .graphic {
    width: auto;
  }
}
</style>
