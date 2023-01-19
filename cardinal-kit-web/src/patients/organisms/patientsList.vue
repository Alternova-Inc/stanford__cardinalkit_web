<template>
  <div class="page">
    <h1 class="mb-5 text-muted">Patients</h1>
    <alt-table :columns="columns" pagination :paginationOptions="paginationOptions" @onPagination="handlePagination">
      <template #t-row>
        <tr v-for="(patient, index) in getPageItems" :key="patient.id">
          <td>{{index + 1}}</td>
          <td>
            {{patient.email || 'NN'}}
          </td>
          <td>
            {{patient.id || 'NN'}}
          </td>
          <td>
            <loading-icon v-if="loadingId == patient.id" size="3px"/>
            <span v-else class="pointer btn-view" @click="handleSelecPatient(patient.id)">
              View
            </span>
          </td>
        </tr>
      </template>
    </alt-table>
  </div>
</template>
<script>
import altTable from '@/components/tables/altTable';
import loadingIcon from "@/components/loading";
  export default {
    name: 'name',
    props: {
      patients:{
        type:Array,
        required:true
      },
      studyId:{
        type:String,
        required:true
      }
    },
    components:{
      altTable,
      loadingIcon,
    },
    data(){
      return{
        columns: [{ header: 'N°' }, { header: 'Email' } ,{header: 'userId'},{ header: 'Action' },{ header: '' }],
        loadingId : 0,
        currentPage: 1,
        limit: 10,
      }
    },
    methods: {
      handleSelecPatient(patientId){
        this.loadingId = patientId
        this.$router.push({name: "healthUser", query: {studyId: this.studyId, userId: patientId }})
      }, 
      handlePagination(pagination) {
        this.currentPage=pagination.currentPage
        this.limit=pagination.limit
        let total = this.patients.length
        if(this.currentPage > Math.ceil(total/this.limit)){
          this.currentPage = Math.ceil(total/this.limit)
        }
      },
    },
    computed:{
      paginationOptions() {
        return {
          limit: [10, 20],
          total: this.patients?.length,
          currentPage: this.currentPage,
        };
      },
      getPageItems() {
        let items = this.patients;
        let lowerLimit = (this.currentPage - 1) * this.limit;
        let upperLimit = this.currentPage * this.limit;
        return items.slice(lowerLimit, upperLimit);
      },
    }
  };
</script>
<style lang="scss" scoped>
  .btn-view{
    padding: 0.4rem 1.8em;
    background: #b71540;
    color: white;
  }
</style>