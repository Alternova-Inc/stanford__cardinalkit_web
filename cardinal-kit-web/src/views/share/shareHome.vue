<template>

 <div class="page">
    <br />
    <div  class="my-2">
      <h1 class="text-muted">Users who have access to my data </h1>
    </div>
    <alt-table :columns="columns" pagination 
      :paginationOptions="paginationOptions"
      @onPagination="handlePagination"
    >
    <template #t-row>
      <tr v-for="user in getPageItems" :key="user.id">
      <td>
      {{user.id}}
      </td>
        <td >
        <modal
            :label="'Remove'"
            :name="user.id"
            title="Are you sure?"
            content="Do you want to remove the access of your data to this user?"
            @accept="remove"
          />
        </td>
      </tr>
    </template>
    </alt-table>
    <div  class="btn-content mt-2">
      <button @click="showAddNewUser=true">Share With New User</button>
    </div>
    <br />

      <div v-show="showAddNewUser">
      <Card>
      <template v-slot:card-header>
        <div class="card-header">
          <h1 id="signup" class="mb-1 text-center text-muted">Search the user by id  </h1>
        </div>
      </template>
      <template v-slot:card-body>
        <form class="login-form" @submit.prevent="share">
          <div class="form-group__horizontal"></div>
          <div class="w-100 form-group">
            <label for="email" class="text-muted">User Id</label>
             <alt-select :options="getDoctorsAdminFormated" v-model="doctorSelected" ref="userSelec" />
          </div>
         
          <button id="b-signup"
            class="btn btn-ck fill-danger w-50 m-auto"
            type="submit">
            Share
          </button>
        </form>
      </template>
    </Card>
      </div>




  </div>

</template>

<script>
import {mapGetters,mapActions} from 'vuex'
import store from "@/store";
import altTable from '@/components/tables/altTable';
import modal from "@/components/modals/modal.vue"
import Card from "@/components/auth/Card";
import altSelect from "@/components/multiSelect/Select";

export default {  
  data(){
    return{
      columns: [{header: 'User Id'}, {header: 'Actions'}],
      currentPage: 1,
      limit: 10,
      showAddNewUser: false,
      email: "",
      doctorSelected: ""
    }
  },
  components: {
    Card,
    altTable,
    altSelect,
    modal
  },
  computed:{
    ...mapGetters("share",["getUsersHaveMyData","getDoctorsAdmin"]),
    getDoctorsAdminFormated(){
      return this.getDoctorsAdmin.map((element)=>{
        return element.id
      })
    },
    paginationOptions() {
      return {
        limit: [10, 20],
        total: 10,
        currentPage: this.currentPage,
      };
    },
    getPageItems() {
      if (this.getUsersHaveMyData){
        let items = this.getUsersHaveMyData;
        let lowerLimit = (this.currentPage - 1) * this.limit;
        let upperLimit = this.currentPage * this.limit;
        return items.slice(lowerLimit, upperLimit);
      }
      return {}
    },
  },
  methods:{
    ...mapActions("share",["ShareMyData","RemoveAccess"]),
    share(){
      console.log(this.$route.params.studyId)
      this.ShareMyData({userId:this.doctorSelected,studyId:this.$route.params.studyId}).then(()=>{
        console.log("shareeee")
       this.reload()
      })
    },
    handlePagination(pagination) {
      this.currentPage=pagination.currentPage
      this.limit=pagination.limit
      let total = this.surveyData.length
      if(this.currentPage > Math.ceil(total/this.limit)){
        this.currentPage = Math.ceil(total/this.limit)
      }
    },
    remove(userId){
      this.RemoveAccess(userId).then(()=>{
        this.reload()
      })
    },
    fuseSearch(options, search){
      console.log("options",option)
      console.log("search",search)
      return options
    },
    reload(){
      this.doctorSelected=""
        this.showAddNewUser=false
        this.$refs["userSelec"].setNewValue(null)
        store.dispatch("share/FetchUserHaveMyData"),
        store.dispatch("share/FetchAllDoctorsAndSuperAdmin")
    }
  },
  beforeRouteEnter(to, from, next){
    Promise.all([
      store.dispatch("share/FetchUserHaveMyData"),
      store.dispatch("share/FetchAllDoctorsAndSuperAdmin")
    ]).then(()=>{
      next()
    })
  }
  
}
</script>