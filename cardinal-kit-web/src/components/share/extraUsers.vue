<template>
<div class="page">
<h1 class="mb-5">Users</h1>
 <alt-table :columns="columns" pagination 
      :paginationOptions="paginationOptions"
      @onPagination="handlePagination"
    >
    <template #t-row>
      <tr v-for="user in getPageItems" :key="user.id">
      <td>
      {{user.id}}
      </td>
      <td>
      {{user.email}}
      </td>
      <td>
      {{user.studyId}}
      </td>
        <td >
            <loading-icon v-if="loadingId == user.id" size="3px"/>
            <span v-else class="pointer btn-view" @click="handleSelecPatient(user)">
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
import modal from "@/components/modals/modal.vue";
import loadingIcon from "@/components/loading";
import {mapGetters} from 'vuex'

export default {
    data(){
        return{
            columns: [{header: 'User Id'},{header: 'Email'},{header: 'Study'}, {header: 'Actions'}],
            currentPage: 1,
            limit: 10,
            loadingId : 0,
        }
    },
    components: {
        altTable,
        modal,
      loadingIcon,
    },
    computed:{
        ...mapGetters("share",["getUsersIHaveAccessTo"]),
        paginationOptions() {
            return {
                limit: [10, 20],
                total: this.getUsersIHaveAccessTo.length,
                currentPage: this.currentPage,
            };
        },
        getPageItems() {
            if (this.getUsersIHaveAccessTo){
                let items = this.getUsersIHaveAccessTo;
                let lowerLimit = (this.currentPage - 1) * this.limit;
                let upperLimit = this.currentPage * this.limit;
                return items.slice(lowerLimit, upperLimit);
            }
            return {}
        },
    },
    methods:{
        handlePagination(pagination) {
            this.currentPage=pagination.currentPage
            this.limit=pagination.limit
            let total = this.surveyData.length
            if(this.currentPage > Math.ceil(total/this.limit)){
                this.currentPage = Math.ceil(total/this.limit)
            }
        },
        handleSelecPatient(user){
            this.loadingId = user.id
            this.$router.push({name: "healthUser", query: {studyId: user.studyId, userId: user.id }})
        }, 
    },
   
}

</script>

<style lang="scss" scoped>
  .btn-view{
    padding: 0.4rem 1.8em;
    background: #b71540;
    color: white;
  }
</style>